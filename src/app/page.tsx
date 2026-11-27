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
  const bestSellers = products.filter(
    (p) => p.tags.includes("best-seller") || p.handle.includes("sock") || p.handle.includes("deo")
  );
  const newArrivals = products.slice().reverse();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mytipe.com";

  // Google Search Structured Data (Organization + Sitelinks Searchbox)
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "Mytipe",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description:
          "Original anatomical Foot Alignment Socks for natural toe separation, plantar fasciitis relief, and everyday comfort.",
        sameAs: ["https://www.instagram.com/mytipeofficial/"],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-9876543210",
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "Mytipe",
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Shop Mytipe Socks (Live Bestsellers & New Arrivals) */}
      <FeaturedProducts
        bestSellers={bestSellers.length > 0 ? bestSellers : products}
        newArrivals={newArrivals.length > 0 ? newArrivals : products}
      />

      {/* 3. Category Cards under SHOP MYTIPE SOCKS */}
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
