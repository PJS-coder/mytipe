"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Truck, ShieldCheck, Zap, Lock, ShoppingBag, Plus, Minus, Check } from "lucide-react";
import { Product, ProductVariant } from "@/types/store";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface ProductInfoProps {
  product: Product;
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
}

export default function ProductInfo({
  product,
  selectedVariant,
  onSelectVariant,
}: ProductInfoProps) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Check if product has an explicit pack option in Shopify
  const hasExplicitPackOption = (product.options || []).some(
    (o) => o.name.toLowerCase().includes("pack") || o.name.toLowerCase().includes("pair")
  );
  const [customPackChoice, setCustomPackChoice] = useState<1 | 2>(1);

  const baseVariantPrice = parseFloat(selectedVariant.price.amount);
  const baseVariantCompare = selectedVariant.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : null;

  // Calculate pricing for single variant products with custom pack choice
  const pack1Price = baseVariantPrice;
  const pack1Compare = baseVariantCompare;
  const pack2OriginalPrice = baseVariantPrice * 2;
  const pack2Discount = Math.round(baseVariantPrice * 0.08 * 2); // e.g., ₹38-₹40 off
  const pack2TotalPrice = pack2OriginalPrice - pack2Discount;

  const currentPrice = hasExplicitPackOption
    ? baseVariantPrice
    : customPackChoice === 2
    ? pack2TotalPrice
    : pack1Price;

  const comparePrice = hasExplicitPackOption
    ? baseVariantCompare
    : customPackChoice === 2
    ? pack2OriginalPrice
    : pack1Compare;

  const discountPercent =
    comparePrice && comparePrice > currentPrice
      ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
      : 0;

  // Function to handle option value change
  const handleOptionSelect = (optionName: string, optionValue: string) => {
    // Current selections mapped
    const currentSelections = new Map<string, string>();
    selectedVariant.selectedOptions.forEach((opt) => {
      currentSelections.set(opt.name.toLowerCase(), opt.value);
    });

    // Update the changed option
    currentSelections.set(optionName.toLowerCase(), optionValue);

    // Find the variant that matches all current selections
    const matchingVariant = product.variants.find((variant) => {
      return variant.selectedOptions.every((opt) => {
        const selectedVal = currentSelections.get(opt.name.toLowerCase());
        return !selectedVal || opt.value.toLowerCase() === selectedVal.toLowerCase();
      });
    });

    if (matchingVariant) {
      onSelectVariant(matchingVariant);
    } else {
      // Fallback to first variant matching the clicked value
      const fallback = product.variants.find((v) =>
        v.selectedOptions.some((o) => o.value.toLowerCase() === optionValue.toLowerCase())
      );
      if (fallback) onSelectVariant(fallback);
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    const effectiveQty = hasExplicitPackOption ? quantity : quantity * customPackChoice;
    addItem(product, selectedVariant, effectiveQty);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleBuyNow = () => {
    const effectiveQty = hasExplicitPackOption ? quantity : quantity * customPackChoice;
    addItem(product, selectedVariant, effectiveQty);

    if (!isAuthenticated) {
      openAuthModal({
        prompt: "Please sign in with your phone to complete your purchase",
        onSuccess: () => {
          router.push("/checkout");
        },
      });
      return;
    }

    router.push("/checkout");
  };

  // Filter out dummy default options
  const displayOptions = (product.options || []).filter(
    (opt) =>
      !(opt.name === "Title" && opt.values?.length === 1 && opt.values[0] === "Default Title")
  );

  // Dynamic product review stats
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [avgRating, setAvgRating] = useState<number>(5);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`mytipe_reviews_${product.handle}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviewCount(parsed.length);
          const sum = parsed.reduce((acc: number, r: any) => acc + (r.rating || 5), 0);
          setAvgRating(sum / parsed.length);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [product.handle]);

  return (
    <div className="space-y-6">
      {/* Star Rating & Review Link */}
      <div className="flex items-center gap-2">
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < (reviewCount > 0 ? Math.round(avgRating) : 5)
                  ? "fill-current text-amber-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("reviews-section") || document.querySelector("section:has(form)");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-xs font-bold text-gray-800 hover:text-blue-600 transition underline underline-offset-2"
        >
          {reviewCount > 0
            ? `${avgRating.toFixed(1)} / 5.0 • ${reviewCount} ${reviewCount === 1 ? "Review" : "Reviews"}`
            : "Add your review"}
        </button>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
          {selectedVariant.availableForSale ? "In Stock" : "Sold Out"}
        </span>
      </div>

      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-950 tracking-tight leading-tight">
          {product.title}
        </h1>
        {product.subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">{product.subtitle}</p>
        )}
      </div>

      {/* Dynamic Price Display */}
      <div className="flex items-baseline gap-3 pb-2 border-b border-gray-100">
        <span className="text-2xl sm:text-3xl font-black text-[#0f1c3f]">
          {formatPrice(currentPrice, selectedVariant.price.currencyCode)}
        </span>
        {comparePrice && comparePrice > currentPrice && (
          <span className="text-sm sm:text-base text-gray-400 line-through font-medium">
            {formatPrice(comparePrice, selectedVariant.price.currencyCode)}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Save {discountPercent}%
          </span>
        )}
      </div>

      {/* Product Description directly under Price */}
      {product.description && (
        <div className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal pt-1">
          <p>{product.description}</p>
        </div>
      )}

      {/* Dynamic Shopify Options (e.g., Pack Size, Color, Size, etc.) */}
      {displayOptions.map((opt) => {
        const currentOptValue =
          selectedVariant.selectedOptions.find(
            (o) => o.name.toLowerCase() === opt.name.toLowerCase()
          )?.value || opt.values[0];

        const isPackSize = opt.name.toLowerCase().includes("pack") || opt.name.toLowerCase().includes("pair");

        return (
          <div key={opt.name} className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-gray-900 uppercase tracking-wider text-xs">
                {opt.name}: <span className="text-blue-700 font-extrabold">{currentOptValue}</span>
              </span>
            </div>

            {/* If Pack Size / Multi-Variant, render rich selection cards with live variant price */}
            {isPackSize ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {opt.values.map((val, valIdx) => {
                  const isSelected = currentOptValue === val;
                  const variantForVal = product.variants.find((v) =>
                    v.selectedOptions.some((o) => o.value === val)
                  );
                  const valPrice = variantForVal ? parseFloat(variantForVal.price.amount) : null;

                  // Find single unit base price (e.g., 1 Pair or Pack of 1)
                  const baseVariant =
                    product.variants.find((v) =>
                      v.selectedOptions.some((o) => /\b1\b|single/i.test(o.value))
                    ) || product.variants[0];
                  const basePrice = baseVariant ? parseFloat(baseVariant.price.amount) : (valPrice || 0);

                  // Extract number from pack title (e.g., "Pack of 2" -> 2)
                  const countMatch = val.match(/\d+/);
                  const count = countMatch ? parseInt(countMatch[0], 10) : valIdx + 1;

                  // Calculated original price by addition of single product prices
                  const calculatedOriginalPrice = count > 1 ? basePrice * count : null;
                  const comparePrice = variantForVal?.compareAtPrice
                    ? parseFloat(variantForVal.compareAtPrice.amount)
                    : calculatedOriginalPrice;

                  const effectiveOriginalPrice =
                    comparePrice && valPrice && comparePrice > valPrice ? comparePrice : null;
                  const rupeesOff =
                    effectiveOriginalPrice && valPrice
                      ? Math.round(effectiveOriginalPrice - valPrice)
                      : 0;
                  const isMostPopular = count === 2 || val.includes("2");

                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleOptionSelect(opt.name, val)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                        isSelected
                          ? "border-[#0f1c3f] bg-slate-50/90 shadow-xs ring-1 ring-[#0f1c3f]/20"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      {/* Most Popular Badge on 2-pack */}
                      {isMostPopular && (
                        <div className="absolute -top-2.5 right-4 z-10">
                          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs border border-amber-300">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "border-[#0f1c3f] bg-[#0f1c3f] text-white"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                              {val}
                            </span>
                            {rupeesOff > 0 && (
                              <span className="inline-block text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5">
                                Save ₹{rupeesOff} OFF
                              </span>
                            )}
                          </div>
                        </div>

                        {valPrice !== null && (
                          <div className="text-right shrink-0">
                            <span className="text-sm sm:text-base font-black text-gray-950">
                              {formatPrice(valPrice, selectedVariant.price.currencyCode)}
                            </span>
                            {effectiveOriginalPrice && (
                              <span className="block text-[11px] text-gray-400 line-through font-medium">
                                {formatPrice(effectiveOriginalPrice, selectedVariant.price.currencyCode)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Standard Pill Selector for other options (Color, Size, etc.) */
              <div className="flex flex-wrap gap-2.5">
                {opt.values.map((val) => {
                  const isSelected = currentOptValue === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleOptionSelect(opt.name, val)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? "border-[#0f1c3f] bg-[#0f1c3f] text-white shadow-xs"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <span>{val}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Universal Pack of 1 vs Pack of 2 selector if product has no explicit Shopify pack option */}
      {!hasExplicitPackOption && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-gray-900 uppercase tracking-wider text-xs">
              Select Quantity &amp; Save:{" "}
              <span className="text-blue-700 font-extrabold">
                {customPackChoice === 2 ? "Pack of 2" : "Pack of 1"}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* 1. Pack of 1 */}
            <button
              type="button"
              onClick={() => setCustomPackChoice(1)}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                customPackChoice === 1
                  ? "border-[#0f1c3f] bg-slate-50/90 shadow-xs ring-1 ring-[#0f1c3f]/20"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      customPackChoice === 1
                        ? "border-[#0f1c3f] bg-[#0f1c3f] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {customPackChoice === 1 && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                    Pack of 1
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm sm:text-base font-black text-gray-950">
                    {formatPrice(baseVariantPrice, selectedVariant.price.currencyCode)}
                  </span>
                  {baseVariantCompare && baseVariantCompare > baseVariantPrice && (
                    <span className="block text-[11px] text-gray-400 line-through font-medium">
                      {formatPrice(baseVariantCompare, selectedVariant.price.currencyCode)}
                    </span>
                  )}
                </div>
              </div>
            </button>

            {/* 2. Pack of 2 - Most Popular */}
            <button
              type="button"
              onClick={() => setCustomPackChoice(2)}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                customPackChoice === 2
                  ? "border-[#0f1c3f] bg-slate-50/90 shadow-xs ring-1 ring-[#0f1c3f]/20"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="absolute -top-2.5 right-4 z-10">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs border border-amber-300">
                  Most Popular
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      customPackChoice === 2
                        ? "border-[#0f1c3f] bg-[#0f1c3f] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {customPackChoice === 2 && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                      Pack of 2
                    </span>
                    {pack2Discount > 0 && (
                      <span className="inline-block text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5">
                        Save ₹{pack2Discount} OFF
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm sm:text-base font-black text-gray-950">
                    {formatPrice(pack2TotalPrice, selectedVariant.price.currencyCode)}
                  </span>
                  <span className="block text-[11px] text-gray-400 line-through font-medium">
                    {formatPrice(pack2OriginalPrice, selectedVariant.price.currencyCode)}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <span className="font-bold text-gray-900 uppercase tracking-wider text-xs block">
          Quantity:
        </span>
        <div className="flex items-center border border-gray-300 rounded-xl bg-slate-50 w-fit">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2.5 text-gray-600 hover:text-gray-900 transition cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-5 text-xs font-bold text-gray-900 select-none">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="p-2.5 text-gray-600 hover:text-gray-900 transition cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Buttons: Single row (BUY NOW first, ADD TO CART second) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!selectedVariant.availableForSale}
          className="w-full py-3 sm:py-3.5 px-4 bg-[#0f1c3f] hover:bg-[#1a2e66] active:scale-[0.99] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Lock className="w-4 h-4 shrink-0" />
          <span>BUY NOW</span>
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || !selectedVariant.availableForSale}
          className="w-full py-3 sm:py-3.5 px-4 bg-slate-900 hover:bg-black active:scale-[0.99] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>
            {!selectedVariant.availableForSale
              ? "SOLD OUT"
              : isAdding
              ? "ADDED!"
              : "ADD TO CART"}
          </span>
        </button>
      </div>

      {/* Urgency & Shipping Notice Box (Under the buttons) */}
      <div className="p-3 sm:p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1.5 text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-bold">
          <Zap className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
          <span>Order in the next 2 hrs 15 mins for Same Day Dispatch</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Truck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Free Express Delivery Above ₹449 &bull; Cash on Delivery Available</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center">
        <div className="p-2 bg-slate-50 rounded-xl space-y-1">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto" />
          <p className="text-[10px] font-bold text-gray-800 uppercase">30-Day Guarantee</p>
          <p className="text-[9px] text-gray-500">100% Satisfaction</p>
        </div>
        <div className="p-2 bg-slate-50 rounded-xl space-y-1">
          <Star className="w-5 h-5 text-amber-500 mx-auto fill-current" />
          <p className="text-[10px] font-bold text-gray-800 uppercase">Top Rated</p>
          <p className="text-[9px] text-gray-500">300k+ Sold</p>
        </div>
        <div className="p-2 bg-slate-50 rounded-xl space-y-1">
          <Truck className="w-5 h-5 text-blue-600 mx-auto" />
          <p className="text-[10px] font-bold text-gray-800 uppercase">Free Shipping</p>
          <p className="text-[9px] text-gray-500">Free COD Available</p>
        </div>
      </div>
    </div>
  );
}
