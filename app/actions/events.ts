"use server";

import { createClient } from "@/lib/supabase/server";
import type { PossibleEvent } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";
import {
  validateEventName,
  validateEventDescription,
  sanitizeString,
} from "@/lib/validation";
import { logger } from "@/lib/logger";

export interface EventWithSuggester extends PossibleEvent {
  suggester_name?: string;
}

export async function getEvents(): Promise<{
  success: boolean;
  data?: EventWithSuggester[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      logger.error("Failed to get user", { error: userError.message });
      return { success: false, error: "Authentication failed" };
    }

    if (!user) {
      return { success: true, data: [] };
    }

    const { data, error } = await supabase
      .from("possible_events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Failed to fetch events", {
        error: error.message,
        userId: user.id,
      });
      return {
        success: false,
        error: "Failed to fetch events. Please try again later.",
      };
    }

    // Get unique user IDs
    const userIds = [...new Set((data || []).map((event) => event.user_id))];
    const userNamesMap = new Map<string, string>();

    // Fetch user names using a database function
    // We'll create a function that can access auth.users
    if (userIds.length > 0) {
      try {
        // Call a database function to get user names
        // This function will be created in the database
        const { data: userNamesData, error: namesError } = await supabase.rpc(
          "get_user_names",
          { user_ids: userIds }
        );

        if (!namesError && userNamesData) {
          // userNamesData should be an array of { user_id, name }
          userNamesData.forEach((item: { user_id: string; name: string }) => {
            if (item.name) {
              userNamesMap.set(item.user_id, item.name);
            }
          });
        } else {
          // Fallback: if function doesn't exist, try direct query
          // We'll handle this gracefully
          logger.error("Failed to fetch user names via RPC", {
            error: namesError?.message,
          });
        }
      } catch (err) {
        logger.error("Error fetching user names", {
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    // Map events to include suggester name
    const eventsWithSuggester: EventWithSuggester[] = (data || []).map((event) => {
      return {
        ...event,
        suggester_name: userNamesMap.get(event.user_id),
      };
    });

    return { success: true, data: eventsWithSuggester };
  } catch (error) {
    logger.error("Unexpected error in getEvents", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

export async function createEvent(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      logger.error("Failed to get user in createEvent", {
        error: userError.message,
      });
      return { success: false, error: "Authentication failed" };
    }

    if (!user) {
      return { success: false, error: "You must be logged in to create events" };
    }

    const name = formData.get("name");
    const description = formData.get("description");

    if (!name || !description || typeof name !== "string" || typeof description !== "string") {
      return { success: false, error: "Name and description are required" };
    }

    // Validate and sanitize inputs
    const nameValidation = validateEventName(name);
    if (!nameValidation.valid) {
      return { success: false, error: nameValidation.error };
    }

    const descriptionValidation = validateEventDescription(description);
    if (!descriptionValidation.valid) {
      return { success: false, error: descriptionValidation.error };
    }

    const sanitizedName = sanitizeString(name);
    const sanitizedDescription = sanitizeString(description);

    const eventData = {
      user_id: user.id,
      name: sanitizedName,
      description: sanitizedDescription,
    };

    const { error } = await supabase.from("possible_events").insert(eventData);

    if (error) {
      logger.error("Failed to create event", {
        error: error.message,
        userId: user.id,
        eventName: sanitizedName,
      });
      return {
        success: false,
        error: "Failed to create event. Please try again later.",
      };
    }

    logger.info("Event created successfully", {
      userId: user.id,
      eventName: sanitizedName,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    logger.error("Unexpected error in createEvent", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

export async function deleteEvent(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      logger.error("Failed to get user in deleteEvent", {
        error: userError.message,
      });
      return { success: false, error: "Authentication failed" };
    }

    if (!user) {
      return { success: false, error: "You must be logged in to delete events" };
    }

    if (!eventId || typeof eventId !== "string") {
      return { success: false, error: "Event ID is required" };
    }

    // First, verify the event exists and belongs to the user
    const { data: event, error: fetchError } = await supabase
      .from("possible_events")
      .select("user_id")
      .eq("id", eventId)
      .single();

    if (fetchError || !event) {
      logger.error("Failed to fetch event for deletion", {
        error: fetchError?.message,
        eventId,
        userId: user.id,
      });
      return { success: false, error: "Event not found" };
    }

    if (event.user_id !== user.id) {
      logger.error("User attempted to delete another user's event", {
        eventId,
        userId: user.id,
        eventUserId: event.user_id,
      });
      return { success: false, error: "You can only delete your own events" };
    }

    const { error: deleteError } = await supabase
      .from("possible_events")
      .delete()
      .eq("id", eventId);

    if (deleteError) {
      logger.error("Failed to delete event", {
        error: deleteError.message,
        eventId,
        userId: user.id,
      });
      return {
        success: false,
        error: "Failed to delete event. Please try again later.",
      };
    }

    logger.info("Event deleted successfully", {
      eventId,
      userId: user.id,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    logger.error("Unexpected error in deleteEvent", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

