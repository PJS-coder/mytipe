"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Product } from "@/types/store";
import ProductGrid from "@/components/product/ProductGrid";
import { trackSearch } from "@/lib/analytics/trackEvent";

interface SearchClientProps {
  products: Product[];
}

function SearchContent({ products }: SearchClientProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.handle.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.options.some((o) => o.values.some((v) => v.toLowerCase().includes(q)))
    );
  }, [products, query]);

  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => {
      trackSearch(query, results.length);
    }, 600);
    return () => clearTimeout(timer);
  }, [query, results.length]);

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
            Search Products
          </h1>
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ankle socks, foot deo, pain relief, colors..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1c3f] shadow-xs"
              autoFocus
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-gray-500">
            <span className="font-semibold">Popular Searches:</span>
            {["Foot & Shoe Deo", "Foot Alignment", "Ankle Socks", "GripFit", "Legacy", "MetroDot"].map(
              (term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-gray-700 font-medium rounded-lg transition cursor-pointer"
                >
                  {term}
                </button>
              )
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-800">
              {query.trim()
                ? `Search results for "${query}" (${results.length})`
                : `All Live Products (${results.length})`}
            </h2>
          </div>

          {results.length > 0 ? (
            <ProductGrid products={results} columns={4} />
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
              <p className="text-gray-600 font-semibold mb-2">No products found matching &ldquo;{query}&rdquo;</p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs font-bold text-[#0f1c3f] hover:underline"
              >
                Clear search to view all products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchClient({ products }: SearchClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f1c3f]" />
        </div>
      }
    >
      <SearchContent products={products} />
    </Suspense>
  );
}
