"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const SERVICE_LINKS = [
  { href: "/services/wordpress-care", label: "WordPress Care" },
  { href: "/services/ecommerce", label: "E-Commerce" },
  { href: "/services/marketing", label: "Marketing" },
  { href: "/services/starter-site", label: "Starter Site" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 text-foreground hover:text-primary transition-colors"
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path d="M6 6l12 12M6 18L18 6" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <nav className="absolute left-0 right-0 top-full bg-background-alt border-b border-foreground/10 z-50 py-4">
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={`link-styles text-lg ${
                pathname === "/" ? "text-primary !decoration-solid !decoration-primary" : ""
              }`}
            >
              Home
            </Link>

            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`link-styles text-lg inline-flex items-center gap-1 ${
                  pathname.startsWith("/services") ? "text-primary !decoration-solid !decoration-primary" : ""
                }`}
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
                  className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {servicesOpen && (
                <div className="flex flex-col items-center gap-2 mt-2">
                  <Link
                    href="/services"
                    onClick={() => setOpen(false)}
                    className="link-styles text-sm text-muted hover:text-primary"
                  >
                    All Services
                  </Link>
                  {SERVICE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="link-styles text-sm text-muted hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className={`link-styles text-lg ${
                pathname === "/contact" ? "text-primary !decoration-solid !decoration-primary" : ""
              }`}
            >
              Contact
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
