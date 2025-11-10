"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { validateEmail, validatePassword } from "@/lib/validation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
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

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.error || "Invalid password");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      // Redirect to confirmation page with email in query params
      router.push(`/signup/confirm?email=${encodeURIComponent(email.trim())}`);
    }
  };

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
            Create your account
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-reindeer-gold-200">
          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-reindeer-red-50 border-2 border-reindeer-red-300 text-reindeer-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="rounded-lg shadow-sm -space-y-px">
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
                  className="appearance-none rounded-t-lg relative block w-full px-4 py-3 border-2 border-reindeer-gold-300 placeholder-reindeer-navy-400 text-reindeer-navy-900 focus:outline-none focus:ring-2 focus:ring-reindeer-green-500 focus:border-reindeer-green-500 focus:z-10 sm:text-sm bg-white"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-b-lg relative block w-full px-4 py-3 border-2 border-t-0 border-reindeer-gold-300 placeholder-reindeer-navy-400 text-reindeer-navy-900 focus:outline-none focus:ring-2 focus:ring-reindeer-green-500 focus:border-reindeer-green-500 focus:z-10 sm:text-sm bg-white"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-reindeer-green-600 to-reindeer-green-500 hover:from-reindeer-green-700 hover:to-reindeer-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reindeer-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? "Creating account..." : "Sign up"}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-reindeer-green-600 hover:text-reindeer-green-700 font-medium text-sm"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

