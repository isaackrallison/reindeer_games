"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
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
            Sign in to Reindeer Games
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-reindeer-gold-200">
          <form className="space-y-6" onSubmit={handleLogin}>
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
                  autoComplete="current-password"
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
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/signup"
                className="text-reindeer-green-600 hover:text-reindeer-green-700 font-medium text-sm"
              >
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

