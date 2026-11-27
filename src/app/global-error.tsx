"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Application Error</h2>
          <p className="text-sm text-gray-600 mb-6">
            A critical system error occurred. Please refresh the page or return to the homepage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="px-5 py-2.5 bg-[#0f1c3f] text-white text-sm font-semibold rounded-xl hover:bg-[#192c5d] transition shadow-md"
            >
              Reload Page
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 bg-gray-100 text-gray-800 text-sm font-semibold rounded-xl hover:bg-gray-200 transition"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
