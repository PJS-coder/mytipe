"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Product, ProductImage, ProductVariant } from "@/types/store";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ClinicalStats from "@/components/product/ClinicalStats";
import ProductAccordions from "@/components/product/ProductAccordions";
import ProductFootCareIntro from "@/components/product/ProductFootCareIntro";
import ProductBannerSection from "@/components/product/ProductBannerSection";
import ProductFAQSection from "@/components/product/ProductFAQSection";
import CustomerReviewsSection from "@/components/product/CustomerReviewsSection";
import StickyAddToCart from "@/components/product/StickyAddToCart";
import ProductCard from "@/components/product/ProductCard";
import { getProductFaqs } from "@/lib/product-faqs";
import { trackViewItem } from "@/lib/analytics/trackEvent";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.handle, product.id]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: `${product.id}-default`,
      title: "Default",
      availableForSale: true,
      selectedOptions: [],
      price: product.priceRange.minVariantPrice,
    }
  );

  // Pre-select pack variant when navigated with ?pack=1|2|3|6
  useEffect(() => {
    if (typeof window === "undefined") return;
    const packParam = new URLSearchParams(window.location.search).get("pack");
    if (!packParam) return;
    const matched = product.variants.find((v) =>
      v.selectedOptions?.some(
        (o) =>
          (o.name.toLowerCase().includes("pack") || o.name.toLowerCase().includes("pair")) &&
          o.value.toLowerCase().startsWith(packParam.toLowerCase())
      )
    );
    if (matched) {
      setSelectedVariant(matched);
    }
  }, [product.variants]);

  useEffect(() => {
    trackViewItem(product, selectedVariant);
  }, [product, selectedVariant]);

  const currentPrice = parseFloat(selectedVariant.price.amount);
  const comparePrice = selectedVariant.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : null;
  const discountBadge =
    comparePrice && comparePrice > currentPrice
      ? `Save ${Math.round(((comparePrice - currentPrice) / comparePrice) * 100)}% Today`
      : undefined;

  // Filter gallery images strictly to the selected color when a product has color variants
  const selectedColorOpt = selectedVariant.selectedOptions?.find(
    (o) => o.name.toLowerCase().includes("color") || o.name.toLowerCase().includes("colour")
  );
  const selectedColor = selectedColorOpt?.value;

  const galleryImages = useMemo<ProductImage[]>(() => {
    if (!selectedColor) {
      return product.images;
    }

    const colorLower = selectedColor.toLowerCase();
    const otherColorUrls = new Set<string>();
    const selectedColorUrls = new Set<string>();

    for (const v of product.variants) {
      const vColor = v.selectedOptions?.find(
        (o) => o.name.toLowerCase().includes("color") || o.name.toLowerCase().includes("colour")
      )?.value;
      if (!vColor || !v.image?.url) continue;

      if (vColor.toLowerCase() === colorLower) {
        selectedColorUrls.add(v.image.url);
      } else {
        otherColorUrls.add(v.image.url);
      }
    }

    // Remove URLs shared with the selected color from otherColorUrls
    for (const url of selectedColorUrls) {
      otherColorUrls.delete(url);
    }

    if (selectedColorUrls.size === 0) {
      return product.images;
    }

    const isPrimaryColor =
      !!product.featuredImage?.url && selectedColorUrls.has(product.featuredImage.url);

    if (isPrimaryColor) {
      // Primary color: show its image(s) + general gallery images, excluding other colors' images
      const filtered = product.images.filter((img) => !otherColorUrls.has(img.url));
      return filtered.length > 0 ? filtered : product.images;
    }

    // Secondary color (e.g. Grey, Blue): ONLY show images belonging to that color
    const matchedImages: ProductImage[] = [];
    const seenUrls = new Set<string>();

    for (const img of product.images) {
      const matchesUrl = selectedColorUrls.has(img.url);
      const matchesAlt = img.altText?.toLowerCase().includes(colorLower);
      if ((matchesUrl || matchesAlt) && !otherColorUrls.has(img.url) && !seenUrls.has(img.url)) {
        matchedImages.push(img);
        seenUrls.add(img.url);
      }
    }

    if (selectedVariant.image?.url && !seenUrls.has(selectedVariant.image.url)) {
      matchedImages.unshift(selectedVariant.image);
    }

    return matchedImages.length > 0 ? matchedImages : product.images;
  }, [product, selectedColor, selectedVariant]);

  return (
    <div className="bg-white min-h-screen pb-20 md:pb-0">
      {/* Breadcrumbs */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 py-2 border-b border-gray-100">
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/collections/all-socks" className="hover:text-blue-600 transition">
            Alignment Socks
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 truncate max-w-xs">{product.title}</span>
        </nav>
      </div>

      {/* Main Product Hero */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 pt-2 sm:pt-4 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 xl:col-span-7">
            <ProductGallery
              key={selectedColor || "default"}
              images={galleryImages}
              title={product.title}
              badge={discountBadge}
              activeImageUrl={selectedVariant.image?.url}
            />
          </div>

          {/* Right Column: Product Info, Options & Buy Buttons */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-6 sm:space-y-8">
            <ProductInfo
              product={product}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />

            {/* Product Accordions: Shipping & Policies */}
            <div className="pt-2">
              <ProductAccordions />
            </div>
          </div>
        </div>
      </div>

      {/* Foot Care Comfort Intro Section */}
      <ProductFootCareIntro />

      {/* Direct Full-Size Product Banner Section */}
      <ProductBannerSection product={product} />

      {/* Why We Are Different From Other Socks */}
      <ClinicalStats />

      {/* Dedicated Styled Product FAQ Section */}
      <ProductFAQSection faqs={getProductFaqs(product)} productTitle={product.title} />

      {/* Customer Reviews Section (Isolated per product) */}
      <CustomerReviewsSection
        productHandle={product.handle}
        productTitle={product.title}
      />

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight">
                YOU MAY ALSO LIKE
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Explore our full line of therapeutic foot &amp; toe care
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Sticky Add to Cart Bar */}
      <StickyAddToCart product={product} selectedVariant={selectedVariant} />
    </div>
  );
}
