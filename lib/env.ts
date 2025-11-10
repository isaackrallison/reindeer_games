/**
 * Validates and returns environment variables
 * Throws an error if a required environment variable is missing
 */
export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Please check your .env.local file.`
    );
  }
  return value;
}

/**
 * Gets Supabase URL from environment variables
 */
export function getSupabaseUrl(): string {
  return getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
}

/**
 * Gets Supabase anonymous key from environment variables
 */
export function getSupabaseAnonKey(): string {
  return getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

