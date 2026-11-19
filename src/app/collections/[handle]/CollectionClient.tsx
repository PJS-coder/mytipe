"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Filter, SlidersHorizontal } from "lucide-react";
import { Collection, Product } from "@/types/store";
import ProductGrid from "@/components/product/ProductGrid";
import FilterSidebar from "@/components/collection/FilterSidebar";
import SortDropdown, { SortOption } from "@/components/collection/SortDropdown";

interface CollectionClientProps {
  collection: Collection;
  products: Product[];
}

export default function CollectionClient({
  collection,
  products,
}: CollectionClientProps) {
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract all available colors dynamically from products
  const availableColors = useMemo(() => {
    const colorSet = new Set<string>();
    products.forEach((p) => {
      const colorOpt = p.options.find((o) => o.name.toLowerCase() === "color");
      colorOpt?.values.forEach((v) => colorSet.add(v));
    });
    return Array.from(colorSet);
  }, [products]);

  // Filters state
  const [filters, setFilters] = useState<{
    colors: string[];
    maxPrice: number;
    category: string;
    concern: string;
  }>({
    colors: [],
    maxPrice: 2500,
    category: [
      "combos",
      "gym-socks",
      "pain-relief-socks",
      "diabetic-socks",
      "office-socks",
      "designer-socks",
    ].includes(collection.handle)
      ? collection.handle
      : "",
    concern: collection.handle.includes("-pain") ? collection.handle : "",
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: [
        "combos",
        "gym-socks",
        "pain-relief-socks",
        "diabetic-socks",
        "office-socks",
        "designer-socks",
      ].includes(collection.handle)
        ? collection.handle
        : "",
      concern: collection.handle.includes("-pain") ? collection.handle : "",
    }));
  }, [collection.handle]);

  const handleResetFilters = () => {
    setFilters({
      colors: [],
      maxPrice: 2500,
      category: "",
      concern: "",
    });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const price = parseFloat(p.priceRange.minVariantPrice.amount);

        // Price filter
        if (price > filters.maxPrice) return false;

        // Color filter
        if (filters.colors.length > 0) {
          const productColors =
            p.options.find((o) => o.name.toLowerCase() === "color")?.values || [];
          const hasColor = filters.colors.some((c) => productColors.includes(c));
          if (!hasColor) return false;
        }

        // Category filter
        if (filters.category) {
          const cat = filters.category.toLowerCase();
          const title = p.title.toLowerCase();
          const handle = p.handle.toLowerCase();
          const tags = p.tags.map((t) => t.toLowerCase());

          let matches = false;
          if (cat === "combos") {
            matches = price === 699 || tags.includes("combos") || handle.includes("kit") || handle.includes("duo");
          } else if (cat === "mytipe-foot-care-kits") {
            matches =
              handle.includes("kit") ||
              handle.includes("duo") ||
              title.includes("kit") ||
              title.includes("duo");
          } else if (cat === "gym-socks") {
            matches =
              tags.includes("gym") ||
              handle.includes("gym") ||
              handle.includes("gripfit") ||
              handle.includes("streetfit") ||
              handle.includes("poweredge") ||
              title.includes("gym") ||
              title.includes("grip");
          } else if (cat === "pain-relief-socks") {
            matches =
              handle.includes("pain-relief") ||
              handle.includes("health") ||
              title.includes("pain relief") ||
              title.includes("health");
          } else if (cat === "diabetic-socks") {
            matches =
              handle.includes("diabetic") ||
              handle.includes("health") ||
              title.includes("diabetic") ||
              title.includes("health");
          } else if (cat === "office-socks") {
            matches =
              handle.includes("legacy") ||
              handle.includes("office") ||
              handle.includes("metrodot") ||
              handle.includes("urbandot") ||
              title.includes("legacy") ||
              title.includes("office");
          } else if (cat === "designer-socks") {
            matches =
              handle.includes("popcorn") ||
              handle.includes("mango-grove") ||
              handle.includes("mountain-vibe") ||
              handle.includes("playdot") ||
              handle.includes("bravemode") ||
              handle.includes("keep-going");
          } else {
            matches =
              p.collections?.includes(cat) ||
              tags.includes(cat) ||
              handle.includes(cat) ||
              title.includes(cat);
          }

          if (!matches) return false;
        }

        // Concern filter
        if (filters.concern) {
          const hasConcern =
            p.collections?.includes(filters.concern) || p.tags.includes(filters.concern);
          if (!hasConcern) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
        const priceB = parseFloat(b.priceRange.minVariantPrice.amount);

        switch (sortOption) {
          case "price-asc":
            return priceA - priceB;
          case "price-desc":
            return priceB - priceA;
          case "rating":
            return (b.rating?.average || 0) - (a.rating?.average || 0);
          case "best-selling":
            return (b.rating?.count || 0) - (a.rating?.count || 0);
          default:
            return 0;
        }
      });
  }, [products, filters, sortOption]);

  return (
    <div className="bg-white min-h-screen">
      {/* Compact Header Bar */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 py-2.5 flex items-center justify-between gap-4">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 overflow-hidden">
            <Link href="/" className="hover:text-blue-600 transition shrink-0">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link href="/collections/all-socks" className="hover:text-blue-600 transition shrink-0">
              Collections
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-gray-900 truncate font-bold">{collection.title}</span>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-800 hover:bg-slate-50 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(filters.colors.length > 0 || filters.category || filters.concern) && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {/* Sort Dropdown */}
            <SortDropdown value={sortOption} onChange={setSortOption} />
          </div>
        </div>
      </div>

      {/* Main Catalog Section - Filters and Products right at the top */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 pt-4 pb-12">
        <div className="flex items-start gap-8 xl:gap-10">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            availableColors={availableColors}
            onReset={handleResetFilters}
            isMobileDrawerOpen={mobileFilterOpen}
            onCloseMobileDrawer={() => setMobileFilterOpen(false)}
            currentHandle={collection.handle}
          />

          {/* Products Grid Area */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={filteredProducts} columns={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
