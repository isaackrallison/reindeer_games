import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";
import { getEnvVar } from "../env";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; sameSite?: "lax" | "strict" | "none"; secure?: boolean }) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: { path?: string; domain?: string; sameSite?: "lax" | "strict" | "none"; secure?: boolean }) {
          try {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          } catch {
            // The `remove` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

