"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sprout,
  Plus,
  X,
  Check,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Feather,
  Wind,
  HeartHandshake,
} from "lucide-react";
import { Product } from "@/types/store";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface MakeYourCareCanClientProps {
  products: Product[];
}

export default function MakeYourCareCanClient({ products }: MakeYourCareCanClientProps) {
  const { addItem } = useCart();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isAddingAll, setIsAddingAll] = useState(false);

  // Filter socks for the builder (exclude deodorants or non-sock items if any, but keep all socks)
  const availableSocks = useMemo(() => {
    return products.filter(
      (p) => !p.handle.includes("deo") && !p.title.toLowerCase().includes("deo")
    );
  }, [products]);

  const handleToggleProduct = (product: Product) => {
    const existingIndex = selectedProducts.findIndex((p) => p.id === product.id);

    if (existingIndex > -1) {
      // Remove from can
      setSelectedProducts((prev) => prev.filter((_, idx) => idx !== existingIndex));
    } else {
      // Add if under 3
      if (selectedProducts.length < 3) {
        setSelectedProducts((prev) => [...prev, product]);
      }
    }
  };

  const handleRemoveSlot = (index: number) => {
    setSelectedProducts((prev) => prev.filter((_, idx) => idx !== index));
  };

  const totalPrice = selectedProducts.reduce((sum, p) => {
    const price = parseFloat(p.priceRange.minVariantPrice.amount) || 189;
    return sum + price;
  }, 0);

  const handleAddCanToCart = () => {
    if (selectedProducts.length !== 3) return;

    setIsAddingAll(true);
    selectedProducts.forEach((prod) => {
      const variant = prod.variants[0] || {
        id: `${prod.id}-default`,
        title: "Default",
        availableForSale: true,
        selectedOptions: [],
        price: prod.priceRange.minVariantPrice,
      };
      addItem(prod, variant, 1);
    });

    setTimeout(() => {
      setIsAddingAll(false);
    }, 600);
  };

  return (
    <div className="bg-[#f8f6f0]/40 min-h-screen">
      {/* 1. HERO SECTION (Full width, natural aspect ratio, no text overlay) */}
      <section className="w-full bg-slate-900">
        <div className="w-full relative">
          <Image
            src="/hero-can.png"
            alt="India's First Grow-Plant Sock Can"
            width={2560}
            height={900}
            priority
            sizes="100vw"
            className="w-full h-auto object-cover block"
          />
        </div>
      </section>

      {/* 2. INTERACTIVE BUNDLE BUILDER SECTION */}
      <section id="builder" className="py-12 sm:py-16 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
            Build Your Pack
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Choose your <strong>3 favorite pairs</strong> to pack into your custom plantable can.
          </p>
        </div>

        {/* 3-Slot Can Tray Bar */}
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-xl mb-12 max-w-4xl mx-auto transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* 3 Slots */}
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center">
              {[0, 1, 2].map((slotIdx) => {
                const item = selectedProducts[slotIdx];

                return (
                  <div key={slotIdx} className="relative">
                    {item ? (
                      <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-2xl border-2 border-emerald-600 bg-white p-1 shadow-sm overflow-hidden group">
                        <Image
                          src={item.featuredImage.url}
                          alt={item.title}
                          fill
                          sizes="90px"
                          className="object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(slotIdx)}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition cursor-pointer z-10"
                          aria-label="Remove item"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl border-2 border-dashed border-gray-300 bg-slate-50 flex flex-col items-center justify-center text-gray-400 gap-1 select-none">
                        <Plus className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase">Pair {slotIdx + 1}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total & Add Button */}
            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
              <div className="text-left sm:text-right">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-bold block">
                  Total ({selectedProducts.length}/3)
                </span>
                <span className="text-xl sm:text-2xl font-black text-gray-950">
                  {formatPrice(totalPrice, "INR")}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddCanToCart}
                disabled={selectedProducts.length !== 3 || isAddingAll}
                className={`px-6 sm:px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                  selectedProducts.length === 3
                    ? "bg-[#0f1c3f] hover:bg-[#1a2e66] text-white hover:shadow-lg active:scale-95"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isAddingAll
                    ? "ADDING..."
                    : selectedProducts.length === 3
                    ? "Add 3 to Cart"
                    : `Pick ${3 - selectedProducts.length} more`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid (4 Columns) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {availableSocks.map((product) => {
            const isSelected = selectedProducts.some((p) => p.id === product.id);
            const price = parseFloat(product.priceRange.minVariantPrice.amount);

            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col group ${
                  isSelected
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
                }`}
              >
                {/* Product Image */}
                <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={product.featuredImage.url}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {isSelected && (
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>In Can</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-sm sm:text-base font-black text-gray-950 mt-1">
                      {formatPrice(price, product.priceRange.minVariantPrice.currencyCode)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleProduct(product)}
                    disabled={!isSelected && selectedProducts.length >= 3}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                        : selectedProducts.length >= 3
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-slate-900 hover:bg-black text-white"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Can</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. ABOUT US & INFOGRAPHIC SECTION */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Column: About Us Copy */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Our Philosophy</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
                About Us
              </h2>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                At MYTIPE, we believe every step should feel supported, fresh, and empowering. Our{" "}
                <strong>Make Your Care Can</strong> concept brings together sustainable, plantable
                packaging and clinically engineered socks designed to support your active lifestyle.
              </p>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Each can contains biodegradable seed paper that transforms into lush green plants
                when potted in your empty can. Smart care for your feet, thoughtful care for the
                planet.
              </p>

              <div className="pt-2">
                <Link
                  href="/collections/all-socks"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0f1c3f] hover:bg-[#1a2e66] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition shadow-md hover:shadow-lg group"
                >
                  <span>Shop All Types</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Column: Official BRAVE Infographic Image */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-red-600 group">
              <Image
                src="/brave.png"
                alt="MYTIPE BRAVE Sock Features Infographic"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. THREE BRAND PILLARS */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-black text-gray-950 text-base sm:text-lg uppercase tracking-tight">
                All-day comfort, tailored for hot and humid climate
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Breathable combed cotton with micro-ventilation channels keeps your feet cool, dry,
                and refreshed in any weather.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-black text-gray-950 text-base sm:text-lg uppercase tracking-tight">
                Fresh feet aren&apos;t a gimmick. They&apos;re essential.
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Antimicrobial fibers stop odor-causing bacteria before it starts, ensuring true
                freshness all day long.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-black text-gray-950 text-base sm:text-lg uppercase tracking-tight">
                Live life in your own type
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Thoughtfully crafted designs that blend orthopedic support with modern lifestyle
                aesthetics.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
