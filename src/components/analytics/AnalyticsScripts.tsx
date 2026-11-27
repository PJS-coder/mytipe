"use client";

import React, { Suspense, useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import {
  GTM_ID,
  META_PIXEL_ID,
  initDataLayer,
  trackEvent,
  trackPageView,
} from "@/lib/analytics/trackEvent";

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams?.toString() || "";
    trackPageView(pathname || "/", search);
  }, [pathname, searchParams]);

  return null;
}

const DOWNLOAD_EXTENSIONS = /\.(pdf|zip|csv|xlsx?|docx?|png|jpe?g|webp)$/i;

export default function AnalyticsScripts() {
  useEffect(() => {
    initDataLayer();

    // Global delegated listener for WhatsApp, phone, email, download, and external links
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (!href) return;

      const label =
        anchor.getAttribute("aria-label") ||
        anchor.textContent?.trim().slice(0, 80) ||
        href;

      // 1. WhatsApp links
      if (href.includes("wa.me") || href.includes("whatsapp.com")) {
        trackEvent(
          "whatsapp_click",
          {
            button_name: label,
            button_location: anchor.closest("footer")
              ? "footer"
              : anchor.closest("header")
              ? "header"
              : "page_body",
            element_type: "whatsapp_link",
            link_url: href.split("?")[0],
          },
          { metaEvent: "Contact" }
        );
        return;
      }

      // 2. Phone number links (tel:)
      if (href.startsWith("tel:")) {
        trackEvent(
          "phone_click",
          {
            button_name: label,
            button_location: anchor.closest("footer") ? "footer" : "page_body",
            element_type: "phone_link",
          },
          { metaEvent: "Contact" }
        );
        return;
      }

      // 3. Email links (mailto:)
      if (href.startsWith("mailto:")) {
        trackEvent(
          "email_click",
          {
            button_name: label,
            button_location: anchor.closest("footer") ? "footer" : "page_body",
            element_type: "email_link",
          },
          { metaEvent: "Contact" }
        );
        return;
      }

      // 4. File downloads
      if (anchor.hasAttribute("download") || DOWNLOAD_EXTENSIONS.test(href)) {
        trackEvent("file_download", {
          file_name: href.split("/").pop() || href,
          link_url: href,
          element_type: "download_link",
        });
        return;
      }

      // 5. External links
      if (href.startsWith("http://") || href.startsWith("https://")) {
        try {
          const url = new URL(href);
          if (url.hostname !== window.location.hostname) {
            trackEvent("external_link_click", {
              button_name: label,
              link_domain: url.hostname,
              link_url: url.origin + url.pathname,
              element_type: "external_link",
            });
          }
        } catch {
          // ignore malformed URLs
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, { passive: true });
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  return (
    <>
      {/* Google Tag Manager (when NEXT_PUBLIC_GTM_ID is configured) */}
      {GTM_ID && (
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      )}

      {/* Meta Pixel Base Code (ID: 1671422437853807) */}
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
            window.__mytipe_initial_fbq_sent__ = true;
          `,
        }}
      />

      {/* Noscript Fallbacks */}
      {GTM_ID && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      {/* SPA Route Navigation Tracker */}
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
    </>
  );
}
