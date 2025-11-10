"use server";

import { createClient } from "@/lib/supabase/server";
import type { PossibleEvent, PossibleEventInsert } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

export async function getEvents(): Promise<PossibleEvent[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("possible_events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return (data as unknown as PossibleEvent[]) || [];
}

export async function createEvent(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in to create events" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name || !description) {
    return { success: false, error: "Name and description are required" };
  }

  const eventData = {
    user_id: user.id,
    name: name.trim(),
    description: description.trim(),
  };

  const { error } = await supabase
    .from("possible_events")
    .insert(eventData);

  if (error) {
    return { success: false, error: `Failed to create event: ${error.message}` };
  }

  revalidatePath("/");
  return { success: true };
}

