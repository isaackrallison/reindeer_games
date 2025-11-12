"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { validateEmail } from "@/lib/validation";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const messageParam = searchParams.get("message");
    if (errorParam === "invalid_token") {
      setError(messageParam || "The magic link is invalid or has expired. Please request a new one.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.error || "Invalid email");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      setEmailSent(true);
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-reindeer-cream-50 via-reindeer-cream-100 to-reindeer-cream-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo-icon.png"
                alt="Reindeer Games"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </div>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-reindeer-green-100 mb-4">
              <svg
                className="h-8 w-8 text-reindeer-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-reindeer-navy-900">
              Check your email
            </h2>
            <p className="mt-4 text-lg text-reindeer-navy-700">
              We&apos;ve sent you a magic link
            </p>
            <p className="mt-2 text-base font-semibold text-reindeer-navy-900">
              {email}
            </p>
          </div>

          <div className="bg-reindeer-gold-50 border-2 border-reindeer-gold-300 rounded-xl p-6 shadow-md">
            <h3 className="text-sm font-semibold text-reindeer-navy-900 mb-3">
              Next steps:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-reindeer-navy-700">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the magic link in the email</li>
              <li>You&apos;ll be signed in automatically</li>
            </ol>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}
              className="text-reindeer-green-600 hover:text-reindeer-green-700 font-medium text-sm"
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-reindeer-cream-50 via-reindeer-cream-100 to-reindeer-cream-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo-icon.png"
              alt="Reindeer Games"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-reindeer-navy-900">
            Sign in to Reindeer Games
          </h2>
          <p className="mt-2 text-sm text-reindeer-navy-600">
            Enter your email and we&apos;ll send you a magic link
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-reindeer-gold-200">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-reindeer-red-50 border-2 border-reindeer-red-300 text-reindeer-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border-2 border-reindeer-gold-300 placeholder-reindeer-navy-400 text-reindeer-navy-900 focus:outline-none focus:ring-2 focus:ring-reindeer-green-500 focus:border-reindeer-green-500 sm:text-sm bg-white"
                placeholder="Enter your email address"
                autoFocus
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-reindeer-green-600 to-reindeer-green-500 hover:from-reindeer-green-700 hover:to-reindeer-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reindeer-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? "Sending magic link..." : "Send magic link"}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/signup"
                className="text-reindeer-green-600 hover:text-reindeer-green-700 font-medium text-sm"
              >
                New to Reindeer Games? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-reindeer-cream-50 via-reindeer-cream-100 to-reindeer-cream-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-reindeer-green-600 mx-auto"></div>
            <p className="mt-4 text-reindeer-navy-600">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

