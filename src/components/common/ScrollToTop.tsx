"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Force immediate scroll to top on every route change
    window.scrollTo(0, 0);
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
