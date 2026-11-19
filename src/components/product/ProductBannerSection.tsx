"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types/store";
import { getOptimizedImageUrl } from "@/lib/utils";

interface ProductBannerSectionProps {
  product: Product;
  bannerUrl?: string;
}

export default function ProductBannerSection({ product, bannerUrl }: ProductBannerSectionProps) {
  const [imageError, setImageError] = useState(false);
  const [storeBanner, setStoreBanner] = useState<string | null>(null);

  useEffect(() => {
    // If product doesn't have an individual custom banner, check if a global store banner is active
    if (!product.banner?.url && !bannerUrl) {
      fetch("/api/admin/banners")
        .then((r) => r.json())
        .then((data) => {
          if (data?.settings?.defaultProductBanner?.enabled && data?.settings?.defaultProductBanner?.url) {
            setStoreBanner(data.settings.defaultProductBanner.url);
          }
        })
        .catch(() => {});
    }
  }, [product.banner?.url, bannerUrl]);

  // Active banner URL: check explicit prop, product.banner.url, or global store banner
  const activeUrl = bannerUrl || product.banner?.url || storeBanner;

  // If no banner is configured yet, or if image failed to load, return null
  if (!activeUrl || imageError) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden block leading-none py-2 sm:py-6 bg-white">
      <div className="w-full relative">
        <Image
          src={getOptimizedImageUrl(activeUrl, 1800)}
          alt={product.banner?.altText || `${product.title} Full Banner`}
          width={product.banner?.width || 2560}
          height={product.banner?.height || 900}
          priority
          unoptimized
          sizes="100vw"
          className="w-full h-auto block object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    </section>
  );
}
