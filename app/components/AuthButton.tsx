"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthButton() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    // Subscribe to auth state changes first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
      setLoading(false);
    });

    // Then get initial user state
    const getInitialUser = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        if (mounted) {
          setUser(currentUser ? { id: currentUser.id, email: currentUser.email } : null);
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialUser();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-8 w-20 bg-reindeer-navy-700 animate-pulse rounded"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-reindeer-cream-100">{user.email}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-reindeer-red-600 rounded-md hover:bg-reindeer-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reindeer-red-500 transition-colors shadow-md hover:shadow-lg"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-medium text-reindeer-cream-100 hover:text-reindeer-cream-50 transition-colors"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="px-4 py-2 text-sm font-medium text-white bg-reindeer-green-600 rounded-md hover:bg-reindeer-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reindeer-green-500 transition-colors shadow-md hover:shadow-lg"
      >
        Sign Up
      </Link>
    </div>
  );
}

