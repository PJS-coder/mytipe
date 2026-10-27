import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MytipeClubPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center bg-white px-4 text-center">
      <div className="space-y-6">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-gray-950">
          Coming Soon...
        </h1>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0f1c3f] hover:underline uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
