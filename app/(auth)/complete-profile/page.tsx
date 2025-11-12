"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { validateEventName } from "@/lib/validation";

export default function CompleteProfilePage() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // If user already has a name, redirect to home
      if (user.user_metadata?.name || user.user_metadata?.full_name) {
        router.push("/");
        return;
      }

      setCheckingAuth(false);
    };

    checkUser();
  }, [supabase.auth, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate name (reusing event name validation for simplicity)
    const nameValidation = validateEventName(name);
    if (!nameValidation.valid) {
      setError(nameValidation.error || "Invalid name");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in to complete your profile");
      setLoading(false);
      return;
    }

    // Update user metadata with name
    const { error: updateError } = await supabase.auth.updateUser({
      data: { name: name.trim() },
    });

    if (updateError) {
      setError(updateError.message || "Failed to save name");
      setLoading(false);
    } else {
      // Redirect to home page
      router.push("/");
      router.refresh();
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-reindeer-cream-50 via-reindeer-cream-100 to-reindeer-cream-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-reindeer-green-600 mx-auto"></div>
          <p className="mt-4 text-reindeer-navy-600">Loading...</p>
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
            Complete Your Profile
          </h2>
          <p className="mt-2 text-sm text-reindeer-navy-600">
            Just one more step! Please tell us your name.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-reindeer-gold-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-reindeer-red-50 border-2 border-reindeer-red-300 text-reindeer-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-reindeer-navy-800 mb-2"
              >
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border-2 border-reindeer-gold-300 placeholder-reindeer-navy-400 text-reindeer-navy-900 focus:outline-none focus:ring-2 focus:ring-reindeer-green-500 focus:border-reindeer-green-500 sm:text-sm bg-white"
                placeholder="Enter your first name"
                autoFocus
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-reindeer-green-600 to-reindeer-green-500 hover:from-reindeer-green-700 hover:to-reindeer-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reindeer-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

