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

export async function getEvents(): Promise<{
  success: boolean;
  data?: PossibleEvent[];
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

    return { success: true, data: (data as PossibleEvent[]) || [] };
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

