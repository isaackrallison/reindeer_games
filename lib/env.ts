/**
 * Validates and returns environment variables
 * Throws an error if a required environment variable is missing
 */
export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    // Provide more helpful error message
    const isClient = typeof window !== "undefined";
    const location = isClient ? "client" : "server";
    throw new Error(
      `Missing required environment variable: ${name} (${location}). ` +
      `Please check your .env.local file and ensure:\n` +
      `1. The variable is set: ${name}=your_value\n` +
      `2. There are no quotes around the value\n` +
      `3. There are no trailing spaces\n` +
      `4. The dev server has been restarted after adding the variable`
    );
  }
  return value.trim();
}

/**
 * Gets Supabase URL from environment variables
 * This works in both server and client contexts
 */
export function getSupabaseUrl(): string {
  // Check if we're in browser and provide helpful error
  if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL is missing. " +
      "Please check your .env.local file and restart the dev server."
    );
  }
  return getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
}

/**
 * Gets Supabase anonymous key from environment variables
 * This works in both server and client contexts
 */
export function getSupabaseAnonKey(): string {
  // Check if we're in browser and provide helpful error
  if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. " +
      "Please check your .env.local file and restart the dev server."
    );
  }
  return getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

