"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  id: number;
  image: string;
  alt: string;
  href: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "/heros.webp",
    alt: "Mytipe - Made To Matter. Foot Alignment Socks",
    href: "/collections/all-socks",
  },
  {
    id: 2,
    image: "/hero2.png",
    alt: "Mytipe Premium Socks Collection",
    href: "/collections/all-socks",
  },
  {
    id: 3,
    image: "/hero3.png",
    alt: "Mytipe Everyday Foot Health & Comfort",
    href: "/collections/all-socks",
  },
  {
    id: 4,
    image: "/hero4.png",
    alt: "Mytipe Ergonomic Support & Performance Socks",
    href: "/collections/all-socks",
  },
];

const AUTOPLAY_INTERVAL_MS = 4500;

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch / Swipe support
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isSwipingRef = useRef(false);

  const totalSlides = HERO_SLIDES.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      goToNext();
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPaused, goToNext]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isSwipingRef.current = false;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = touchStartXRef.current - e.touches[0].clientX;
    const diffY = touchStartYRef.current - e.touches[0].clientY;

    // Check if horizontal swipe dominates vertical scroll
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null && isSwipingRef.current) {
      const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
      if (diffX > 45) {
        // Swiped left -> next
        goToNext();
      } else if (diffX < -45) {
        // Swiped right -> prev
        goToPrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    isSwipingRef.current = false;
    setIsPaused(false);
  };

  return (
    <section
      className="relative w-full bg-[#1b1c20] -mt-2 sm:-mt-4 lg:-mt-6 group overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured promotions carousel"
    >
      {/* Carousel Track Container */}
      <div className="relative w-full aspect-[16/8.8] sm:aspect-[16/8.8] lg:aspect-[1.92/1] overflow-hidden">
        <div
          className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className="relative min-w-full w-full h-full shrink-0 overflow-hidden"
              aria-hidden={index !== currentIndex}
            >
              <Link
                href={slide.href}
                className="relative block w-full h-full cursor-pointer"
                tabIndex={index === currentIndex ? 0 : -1}
                aria-label={slide.alt}
                onClick={(e) => {
                  if (isSwipingRef.current) {
                    e.preventDefault();
                  }
                }}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-[center_top] transition-transform duration-700 ease-out"
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToPrev();
          }}
          className="absolute left-2.5 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md opacity-75 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-2.5 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md opacity-75 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/35 backdrop-blur-sm border border-white/10">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-white shadow-sm"
                    : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
