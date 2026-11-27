"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics/trackEvent";

interface HeroSlide {
  id: number;
  desktopImage: string;
  mobileImage: string;
  alt: string;
  href: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    desktopImage: "/hero3.webp",
    mobileImage: "/hero1mobile.webp",
    alt: "Mytipe Everyday Foot Health & Comfort",
    href: "/collections/all-socks",
  },
  {
    id: 2,
    desktopImage: "/hero2.webp",
    mobileImage: "/hero2mobile.webp",
    alt: "Mytipe Premium Socks Collection",
    href: "/collections/all-socks",
  },
  {
    id: 3,
    desktopImage: "/hero4.webp",
    mobileImage: "/hero3mobile.webp",
    alt: "Mytipe Ergonomic Support & Performance Socks",
    href: "/collections/all-socks",
  },
];

const AUTOPLAY_INTERVAL_MS = 3500;

export default function Hero() {
  // Cloned slides for seamless infinite circular looping
  const extendedSlides = [
    { ...HERO_SLIDES[HERO_SLIDES.length - 1], key: "clone-last" },
    ...HERO_SLIDES.map((slide) => ({ ...slide, key: `real-${slide.id}` })),
    { ...HERO_SLIDES[0], key: "clone-first" },
  ];

  // Start at index 1 (the first real slide: /hero3.png)
  const [currentIndex, setCurrentIndex] = useState(1);
  const [withTransition, setWithTransition] = useState(true);

  const isAnimatingRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isSwipingRef = useRef(false);

  const goToNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);

    // Failsafe unlock in case onTransitionEnd doesn't fire
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 800);
  }, []);

  const goToPrev = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setWithTransition(true);
    setCurrentIndex((prev) => prev - 1);

    // Failsafe unlock in case onTransitionEnd doesn't fire
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 800);
  }, []);

  const goToSlide = (slideIndex: number) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setWithTransition(true);
    setCurrentIndex(slideIndex + 1);

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 800);
  };

  // Seamless infinite loop transition reset
  const handleTransitionEnd = () => {
    if (currentIndex >= extendedSlides.length - 1) {
      // Reached the end clone -> instantly jump to index 1 (first real slide)
      setWithTransition(false);
      setCurrentIndex(1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
          isAnimatingRef.current = false;
        });
      });
    } else if (currentIndex <= 0) {
      // Reached the start clone -> instantly jump to last real slide
      setWithTransition(false);
      setCurrentIndex(extendedSlides.length - 2);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
          isAnimatingRef.current = false;
        });
      });
    } else {
      isAnimatingRef.current = false;
    }
  };

  // Continuous infinite autoplay (does not get stuck or stop on hover)
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [goToNext]);

  // Touch / Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = touchStartXRef.current - e.touches[0].clientX;
    const diffY = touchStartYRef.current - e.touches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null && isSwipingRef.current) {
      const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
      if (diffX > 45) {
        goToNext();
      } else if (diffX < -45) {
        goToPrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    setTimeout(() => {
      isSwipingRef.current = false;
    }, 50);
  };

  // Calculate active indicator dot (0 to 3)
  const activeDotIndex =
    currentIndex === 0
      ? HERO_SLIDES.length - 1
      : currentIndex === extendedSlides.length - 1
        ? 0
        : currentIndex - 1;

  return (
    <section
      className="relative w-full bg-[#0b2545] group overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured promotions carousel"
    >
      {/* Carousel Track Container - 80% viewport height cap on mobile with natural aspect ratio; widescreen on desktop */}
      <div className="relative w-full aspect-[941/1440] max-h-[80dvh] sm:h-auto sm:aspect-[1672/941] sm:max-h-[calc(100vh-102px)] overflow-hidden">
        <div
          className={`flex h-full w-full ${withTransition
            ? "transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            : "transition-none"
            }`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((slide, index) => {
            const isInitialSlide = index === 1;
            return (
              <div
                key={slide.key}
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
                      return;
                    }
                    trackEvent("hero_banner_click", {
                      slide_id: slide.id,
                      button_name: slide.alt,
                      button_location: "hero_carousel",
                    });
                  }}
                >
                  {/* Mobile View Hero Banner - Edge-to-edge full width with zero cut */}
                  <div className="block sm:hidden relative w-full h-full">
                    <Image
                      src={slide.mobileImage}
                      alt={slide.alt}
                      fill
                      priority={isInitialSlide}
                      loading="eager"
                      unoptimized
                      sizes="100vw"
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Desktop / Tablet View Hero Banner */}
                  <div className="hidden sm:block relative w-full h-full">
                    <Image
                      src={slide.desktopImage}
                      alt={slide.alt}
                      fill
                      priority={isInitialSlide}
                      loading="eager"
                      unoptimized
                      sizes="100vw"
                      className="object-cover object-center transition-transform duration-700 ease-out"
                    />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Previous Button - Small on mobile, full-size on PC */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToPrev();
          }}
          className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md opacity-75 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
        </button>

        {/* Next Button - Small on mobile, full-size on PC */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md opacity-75 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
        </button>

        {/* Indicator Dots - Compact & smaller on mobile, standard on PC */}
        <div className="absolute bottom-2 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full bg-black/35 backdrop-blur-sm border border-white/10">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === activeDotIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${isActive
                  ? "w-4 sm:w-8 h-1 sm:h-2 bg-white shadow-sm"
                  : "w-1 sm:w-2 h-1 sm:h-2 bg-white/50 hover:bg-white/80"
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
