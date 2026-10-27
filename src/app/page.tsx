import React from "react";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryCards from "@/components/home/CategoryCards";
import StorySection from "@/components/home/StorySection";
import InstagramFeed from "@/components/home/InstagramFeed";
import MakeYourCareCanSection from "@/components/home/MakeYourCareCanSection";
import ReviewsGrid from "@/components/home/ReviewsGrid";
import { fetchLiveProducts } from "@/lib/store/fetcher";

export default async function HomePage() {
  const products = await fetchLiveProducts();
  const bestSellers = products.filter((p) => p.tags.includes("best-seller") || p.handle.includes("sock") || p.handle.includes("deo"));
  const newArrivals = products.slice().reverse();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Shop Mytipe Socks (Live Bestsellers & New Arrivals) */}
      <FeaturedProducts
        bestSellers={bestSellers.length > 0 ? bestSellers : products}
        newArrivals={newArrivals.length > 0 ? newArrivals : products}
      />

      {/* 4. Category Cards (Gym, Diabetic, Office, Designer, Kits) */}
      <CategoryCards />

      {/* 5. Best Seller Spotlight Section with pain-sock.png */}
      <StorySection />

      {/* 6. Real Instagram Reels Feed (@mytipeofficial) */}
      <InstagramFeed />

      {/* 7. Make Your Care Can Section (India's First Grow-Plant Sock Can) */}
      <MakeYourCareCanSection />

      {/* 8. Customer Testimonials & 300k+ Pairs Sold with Real Socks Photos */}
      <ReviewsGrid />
    </div>
  );
}
