"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignupConfirmContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

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
            We&apos;ve sent you a confirmation email
            {email && (
              <span className="block mt-2 text-base font-semibold text-reindeer-navy-900">
                {email}
              </span>
            )}
          </p>
        </div>

        <div className="bg-reindeer-gold-50 border-2 border-reindeer-gold-300 rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-semibold text-reindeer-navy-900 mb-3">
            Next steps:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-reindeer-navy-700">
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the confirmation link in the email</li>
            <li>Return here to sign in</li>
          </ol>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-reindeer-navy-600">
            Didn&apos;t receive an email? Check your spam folder or{" "}
            <Link
              href="/signup"
              className="font-semibold text-reindeer-green-600 hover:text-reindeer-green-700"
            >
              try signing up again
            </Link>
          </p>
          <div>
            <Link
              href="/login"
              className="inline-block px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-reindeer-green-600 to-reindeer-green-500 rounded-lg hover:from-reindeer-green-700 hover:to-reindeer-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reindeer-green-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupConfirmPage() {
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
      <SignupConfirmContent />
    </Suspense>
  );
}

