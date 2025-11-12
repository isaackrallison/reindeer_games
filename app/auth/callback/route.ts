import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  const supabase = await createClient();

  // Handle code-based exchange (Supabase PKCE flow)
  if (code) {
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user has a name (first-time user check)
      const hasName = data.user.user_metadata?.name || data.user.user_metadata?.full_name;

      if (!hasName) {
        // First-time user - redirect to complete profile
        redirect("/complete-profile");
      } else {
        // Existing user with name - redirect to home
        redirect(next);
      }
    } else {
      // Redirect to login with error if verification fails
      const errorDescription = error?.message || "Invalid or expired link";
      redirect(`/login?error=invalid_token&message=${encodeURIComponent(errorDescription)}`);
    }
    return;
  }

  // Handle token_hash-based verification (legacy flow)
  if (token_hash && type) {
    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error && data.user) {
      // Check if user has a name (first-time user check)
      const hasName = data.user.user_metadata?.name || data.user.user_metadata?.full_name;

      if (!hasName) {
        // First-time user - redirect to complete profile
        redirect("/complete-profile");
      } else {
        // Existing user with name - redirect to home
        redirect(next);
      }
    } else {
      // Redirect to login with error if verification fails
      const errorDescription = error?.message || "Invalid or expired link";
      redirect(`/login?error=invalid_token&message=${encodeURIComponent(errorDescription)}`);
    }
    return;
  }

  // Handle error parameters from Supabase redirect
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  if (errorParam) {
    redirect(`/login?error=invalid_token&message=${encodeURIComponent(errorDescription || errorParam)}`);
    return;
  }

  // Missing required parameters
  redirect("/login?error=invalid_token");
}

