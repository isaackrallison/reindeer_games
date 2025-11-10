import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Creates a Supabase client for use in browser/client components
 * 
 * NOTE: NEXT_PUBLIC_* environment variables are embedded at build time by Next.js
 * If you see errors about missing env vars:
 * 1. Ensure .env.local exists in the project root
 * 2. Restart the dev server (npm run dev)
 * 3. Clear .next cache if needed (rm -rf .next)
 */
export function createClient() {
  // Access env vars directly - Next.js will replace these at build/compile time
  // Using string literals ensures Next.js can statically analyze and replace them
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validate that variables exist
  if (!supabaseUrl) {
    const errorMsg = 
      `Missing NEXT_PUBLIC_SUPABASE_URL environment variable.\n` +
      `Please check:\n` +
      `1. .env.local exists in the project root\n` +
      `2. NEXT_PUBLIC_SUPABASE_URL is set in .env.local\n` +
      `3. You've restarted the dev server\n` +
      `4. The .env.local file is in the correct format (no quotes, no spaces around =)`;
    
    if (typeof window !== "undefined") {
      // In browser, show helpful error
      console.error(errorMsg);
    }
    throw new Error(errorMsg);
  }

  if (!supabaseAnonKey) {
    const errorMsg = 
      `Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.\n` +
      `Please check:\n` +
      `1. .env.local exists in the project root\n` +
      `2. NEXT_PUBLIC_SUPABASE_ANON_KEY is set in .env.local\n` +
      `3. You've restarted the dev server\n` +
      `4. The .env.local file is in the correct format (no quotes, no spaces around =)`;
    
    if (typeof window !== "undefined") {
      // In browser, show helpful error
      console.error(errorMsg);
    }
    throw new Error(errorMsg);
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

