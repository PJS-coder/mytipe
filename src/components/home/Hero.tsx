"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full bg-[#1b1c20] -mt-2 sm:-mt-4 lg:-mt-6">
      {/* Full Hero Banner */}
      <Link
        href="/collections/all-socks"
        className="relative block w-full aspect-[16/8.8] sm:aspect-[16/8.8] lg:aspect-[1.92/1] overflow-hidden group cursor-pointer"
        aria-label="Shop Mytipe Foot Alignment Socks"
      >
        <Image
          src="/heros.png"
          alt="Mytipe - Made To Matter. Foot Alignment Socks"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_top] group-hover:scale-[1.008] transition-transform duration-500 ease-out"
        />
      </Link>
    </section>
  );
}
