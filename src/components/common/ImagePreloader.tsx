"use client";

import { useEffect } from "react";
import { getOptimizedImageUrl } from "@/lib/utils";

const CRITICAL_ASSETS = [
  "/hero3.webp",
  "/hero2.webp",
  "/hero4.webp",
  "/hero1mobile.webp",
  "/hero2mobile.webp",
  "/hero3mobile.webp",
  "/pain-sock.webp",
  "/foot&shoedeo.webp",
  "/gym-sock.webp",
  "/office-sock.webp",
  "/hero-can.webp",
  "https://cdn.shopify.com/s/files/1/0753/9100/8966/files/ChatGPT-Image-Jun-27-2026-02_42_41-AM-1.webp?v=1785136660",
  "https://res.cloudinary.com/pjdh0da6/image/upload/v1794985463/mytipe_products/1793602212087-M10.png",
  "https://res.cloudinary.com/pjdh0da6/image/upload/v1794985472/mytipe_products/1793615233363-ChatGPT_Image_Jul_31__2026__06_05_29_PM.png",
  "https://res.cloudinary.com/pjdh0da6/image/upload/v1794985471/mytipe_products/1793615216478-ChatGPT_Image_Jul_31__2026__06_08_47_PM.png",
];

/**
 * Eagerly warms browser cache for critical hero, category, and product images
 * immediately after mount so page transitions and sliders load instantaneously.
 */
export default function ImagePreloader() {
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

    const preloadList = CRITICAL_ASSETS.filter((src) => {
      if (isMobile && (src === "/hero3.webp" || src === "/hero2.webp" || src === "/hero4.webp")) {
        return false;
      }
      if (!isMobile && src.includes("mobile.webp")) {
        return false;
      }
      return true;
    });

    preloadList.forEach((src) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = src.startsWith("http") ? getOptimizedImageUrl(src, 800) : src;
    });
  }, []);

  return null;
}
