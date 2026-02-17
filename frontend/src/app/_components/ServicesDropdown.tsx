"use client";

import { useState } from "react";
import Link from "next/link";

export default function ServicesDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link href="/services" className="inline-flex items-center gap-1">
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
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </Link>
      {open && (
        <div className="absolute top-full right-0 pt-2 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-foreground/10 py-2 min-w-[200px]">
            <Link
              href="/services/wordpress-care"
              className="block px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
            >
              WordPress Care
            </Link>
            <Link
              href="/services/ecommerce"
              className="block px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
            >
              E-Commerce
            </Link>
            <Link
              href="/services/marketing"
              className="block px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
            >
              Marketing
            </Link>
            <Link
              href="/services/starter-site"
              className="block px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
            >
              Starter Site
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
