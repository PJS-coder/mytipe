import { Suspense } from "react";
import { Metadata } from "next";
import { fetchLiveProducts } from "@/lib/store/fetcher";

import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search Products | Mytipe",
  description: "Search all therapeutic foot care products and alignment socks from MYTIPE.",
};

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const products = await fetchLiveProducts();

  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-[#0f1c3f] rounded-full animate-spin" />
        </div>
      }
    >
      <SearchClient products={products} />
    </Suspense>
  );
}
