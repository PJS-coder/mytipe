"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ProductImage } from "@/types/store";
import { getOptimizedImageUrl } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
  badge?: string;
}

export default function ProductGallery({ images, title, badge }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set of image indices whose full-size asset is already cached in memory
  const loadedIndicesRef = useRef<Set<number>>(new Set([0]));

  // Touch tracking for swipe gestures
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const totalImages = images?.length || 0;
  const activeImage = images[selectedIndex] || images[0];
  const displayedImage = images[displayedIndex] || images[0];

  // Switch image selection safely with double-buffering
  const handleSelectImage = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= totalImages) return;
      if (targetIndex === selectedIndex) return;

      setSelectedIndex(targetIndex);

      // If image is already in memory cache, display instantly (0ms latency!)
      if (loadedIndicesRef.current.has(targetIndex)) {
        setDisplayedIndex(targetIndex);
      }
      // If not yet cached, displayedIndex stays on the previous image until the new one finishes loading
    },
    [selectedIndex, totalImages]
  );

  const handlePrev = useCallback(() => {
    if (totalImages <= 1) return;
    const prev = (selectedIndex - 1 + totalImages) % totalImages;
    handleSelectImage(prev);
  }, [selectedIndex, totalImages, handleSelectImage]);

  const handleNext = useCallback(() => {
    if (totalImages <= 1) return;
    const next = (selectedIndex + 1) % totalImages;
    handleSelectImage(next);
  }, [selectedIndex, totalImages, handleSelectImage]);

  // Preload adjacent (next & previous) images after first render without blocking page load
  useEffect(() => {
    if (!images || totalImages <= 1) return;

    const toPreload = [
      (selectedIndex + 1) % totalImages,
      (selectedIndex - 1 + totalImages) % totalImages,
    ];

    const timer = setTimeout(() => {
      toPreload.forEach((idx) => {
        const item = images[idx];
        if (item && typeof window !== "undefined") {
          const preloadImg = new window.Image();
          const targetUrl = getOptimizedImageUrl(item.url, 900);
          preloadImg.src = targetUrl;
          preloadImg.onload = () => {
            loadedIndicesRef.current.add(idx);
          };
        }
      });
    }, 120);

    return () => clearTimeout(timer);
  }, [selectedIndex, images, totalImages]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Trigger if horizontal movement is dominant and > 35px
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) {
        if (e.key === "Escape") setIsModalOpen(false);
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handlePrev, handleNext]);

  // Desktop hover zoom coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  if (!images || totalImages === 0) {
    return (
      <div className="relative aspect-square w-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        No image available
      </div>
    );
  }

  return (
    <>
      <div className="lg:sticky lg:top-28 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 xl:gap-6 items-start w-full">
        {/* ================= THUMBNAILS (LEFT ON DESKTOP, BOTTOM ON MOBILE) ================= */}
        {totalImages > 1 && (
          <div className="flex sm:flex-col gap-2.5 sm:gap-3 xl:gap-3.5 w-full sm:w-20 md:w-24 xl:w-26 sm:shrink-0 overflow-x-auto sm:overflow-y-auto sm:max-h-[580px] xl:max-h-[680px] py-1 custom-scrollbar">
            {images.map((img, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectImage(idx)}
                  className={`relative aspect-square w-16 sm:w-20 md:w-24 xl:w-26 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border-2 transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? "border-[#2b76a6] ring-2 ring-[#2b76a6]/30 shadow-md scale-95"
                      : "border-gray-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image
                    src={getOptimizedImageUrl(img.url, 120)}
                    alt={img.altText || `${title} thumbnail ${idx + 1}`}
                    fill
                    unoptimized
                    sizes="96px"
                    className="object-cover object-center"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* ================= MAIN DISPLAY VIEWPORT WITH ZERO BLANK FLASH ================= */}
        <div
          className="relative aspect-square flex-1 w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-md group select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          {/* Base Layer: Currently displayed image (Keeps visible until new image arrives) */}
          {displayedImage && (
            <div
              className={`absolute inset-0 transition-opacity duration-200 ${
                selectedIndex === displayedIndex ? "opacity-100" : "opacity-90"
              }`}
            >
              <Image
                src={getOptimizedImageUrl(displayedImage.url, 900)}
                alt={displayedImage.altText || title}
                fill
                priority={displayedIndex === 0}
                unoptimized
                sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 60vw, 900px"
                className={`object-cover object-center transition-transform duration-300 ease-out ${
                  isZoomed ? "scale-135" : "scale-100"
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                      }
                    : undefined
                }
              />
            </div>
          )}

          {/* Incoming Target Layer: Only rendered when selectedIndex !== displayedIndex */}
          {selectedIndex !== displayedIndex && activeImage && (
            <div className="absolute inset-0 z-5">
              <Image
                src={getOptimizedImageUrl(activeImage.url, 900)}
                alt={activeImage.altText || title}
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 60vw, 900px"
                className="object-cover object-center opacity-0"
                onLoad={() => {
                  loadedIndicesRef.current.add(selectedIndex);
                  setDisplayedIndex(selectedIndex);
                }}
              />
            </div>
          )}

          {/* Discount / Special Badge */}
          {badge && (
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <span className="bg-[#ffe4e6] text-[#e11d48] text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                {badge}
              </span>
            </div>
          )}

          {/* Fullscreen Zoom Trigger Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="absolute top-4 right-4 z-10 p-2 sm:p-2.5 rounded-xl bg-white/90 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hidden sm:flex items-center justify-center"
            title="Click to expand high-res image"
          >
            <ZoomIn className="w-4 h-4 text-gray-700" />
          </button>

          {/* Navigation Arrows: Left & Right */}
          {totalImages > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-lg backdrop-blur-xs flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-lg backdrop-blur-xs flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>

              {/* Mobile Dots / Image Counter */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold tracking-wider sm:hidden">
                {selectedIndex + 1} / {totalImages}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= FULLSCREEN HIGH-RES MODAL ZOOM ================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            aria-label="Close fullscreen view"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Fullscreen Main Image */}
          <div
            className="relative w-full max-w-4xl max-h-[85vh] aspect-square"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={getOptimizedImageUrl(activeImage.url, 1200)}
              alt={activeImage.altText || title}
              fill
              unoptimized
              sizes="100vw"
              className="object-contain"
              priority
            />

            {/* Modal Navigation Arrows */}
            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
