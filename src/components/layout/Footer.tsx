"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { trackEvent } from "@/lib/analytics/trackEvent";

export default function Footer() {
  const handleFooterClick = (e: React.MouseEvent<HTMLElement>) => {
    const anchor = (e.target as HTMLElement | null)?.closest("a");
    if (!anchor) return;
    const label = anchor.getAttribute("aria-label") || anchor.textContent?.trim() || anchor.getAttribute("href") || "footer_link";
    trackEvent("footer_link_click", {
      button_name: label,
      button_location: "footer",
      element_type: "link",
      link_url: anchor.getAttribute("href") || "",
    });
  };

  return (
    <footer onClick={handleFooterClick} className="bg-black text-white pt-16 pb-12 border-t border-zinc-900">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand & Follow The Flock */}
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tight text-white uppercase">
                Mytipe
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
                India&apos;s leading orthotic toe-alignment and foot pain relief socks. Real alignment, proven comfort.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <h4 className="text-sm sm:text-base font-medium text-white">
                Follow The Flock
              </h4>
              <div className="flex items-center gap-3 text-white">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61577546875826"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/80 flex items-center justify-center hover:bg-white hover:text-black transition"
                  aria-label="Facebook @mytipe"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/mytipeofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/80 flex items-center justify-center hover:bg-white hover:text-black transition"
                  aria-label="Instagram @mytipeofficial"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products/foot-shoe-deo" className="hover:text-white transition">
                  Our Super Hero
                </Link>
              </li>
              <li>
                <Link href="/collections/all-socks" className="hover:text-white transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-white">Categories</h3>
            <ul className="space-y-2.5 text-sm text-zinc-300">
              <li>
                <Link href="/products/foot-alignment-socks" className="hover:text-white transition">
                  Pain Relief Socks
                </Link>
              </li>
              <li>
                <Link href="/collections/gym-socks" className="hover:text-white transition">
                  Gym Socks
                </Link>
              </li>
              <li>
                <Link href="/collections/office-socks" className="hover:text-white transition">
                  Office Socks
                </Link>
              </li>
              <li>
                <Link href="/collections/diabetic-socks" className="hover:text-white transition">
                  Diabetic Socks
                </Link>
              </li>
              <li>
                <Link href="/collections/designer-socks" className="hover:text-white transition">
                  Designer Socks
                </Link>
              </li>
              <li>
                <Link href="/collections/combos" className="hover:text-white transition">
                  Combos
                </Link>
              </li>
              <li>
                <Link href="/make-your-care-can" className="hover:text-white transition">
                  Make Your Care Can
                </Link>
              </li>
              <li>
                <Link href="/collections/all-socks" className="hover:text-white transition font-semibold text-white">
                  Shop All Categories &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Address & Contact */}
          <div className="space-y-4 text-sm text-zinc-300">
            <h3 className="text-base sm:text-lg font-medium text-white">Address</h3>
            <p className="leading-relaxed flex items-start gap-2">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <span>1st Floor, Laxmi Enclave, Derakhas, Near Indresh Hospital, Dehradun, Uttarakhand – 248001</span>
            </p>

            <div className="pt-2 space-y-2">
              <h4 className="text-base font-medium text-white">Contact Us</h4>
              <div className="space-y-1.5">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                  <a href="tel:7310585356" className="font-semibold text-white hover:underline">
                    +91 7310585356
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                  <a
                    href="mailto:muditmalhotra101@gmail.com"
                    className="text-zinc-200 hover:text-white hover:underline transition break-all"
                  >
                    muditmalhotra101@gmail.com
                  </a>
                </p>
              </div>
              <p className="text-xs text-zinc-400 pt-0.5">
                Monday – Friday: 9:00 AM – 6:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
          <p>© 2026 Mytipe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
