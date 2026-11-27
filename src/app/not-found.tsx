import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 text-center bg-white">
      <div className="max-w-md mx-auto">
        <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-red-600 uppercase bg-red-50 rounded-full border border-red-200 mb-4">
          404 Error
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed">
          The page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0f1c3f] hover:bg-[#1a2d5e] text-white text-sm font-semibold shadow-md transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </Link>
          <Link
            href="/collections/all-socks"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop All Socks
          </Link>
        </div>

        {/* Quick Collections Link Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-3">
            Popular Categories
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/collections/combos"
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium transition"
            >
              Value Combos
            </Link>
            <Link
              href="/collections/gym-socks"
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium transition"
            >
              Gym Socks
            </Link>
            <Link
              href="/collections/office-socks"
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium transition"
            >
              Office Socks
            </Link>
            <Link
              href="/make-your-care-can"
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium transition"
            >
              Make Your Care Can
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
