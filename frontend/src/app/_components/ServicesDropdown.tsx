"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function ServicesDropdown() {
  const [clicked, setClicked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!clicked) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setClicked(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [clicked]);

  return (
    <div ref={ref} className="relative group">
      <button
        type="button"
        onClick={() => setClicked((prev) => !prev)}
        className="link-styles inline-flex items-center gap-1 cursor-pointer"
      >
        Services
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:rotate-180"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* CSS hover: always in DOM, shown/hidden via group-hover */}
      <div className={`absolute top-full right-0 pt-2 z-50 transition-all duration-150 ${
        clicked
          ? "opacity-100 visible"
          : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
      }`}>
        <div className="bg-white rounded-lg shadow-lg border border-foreground/10 py-2 min-w-[200px]">
          <Link
            href="/services"
            onClick={() => setClicked(false)}
            className="block px-4 py-2 text-sm font-medium hover:bg-primary/5 hover:text-primary transition-colors"
          >
            All Services
          </Link>
          <Link
            href="/services/wordpress-care"
            onClick={() => setClicked(false)}
            className="block px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
          >
            WordPress Care
          </Link>
          <Link
            href="/services/ecommerce"
            onClick={() => setClicked(false)}
            className="block px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
          >
            E-Commerce
          </Link>
          <Link
            href="/services/marketing"
            onClick={() => setClicked(false)}
            className="block px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
          >
            Marketing
          </Link>
          <Link
            href="/services/starter-site"
            onClick={() => setClicked(false)}
            className="block px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
          >
            Starter Site
          </Link>
        </div>
      </div>
    </div>
  );
}
