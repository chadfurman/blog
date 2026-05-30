"use client";

import {useEffect, useState} from "react";
import Icon from "./Icon";
import {navLinks, profile} from "@/data/portfolio";

const SECTION_IDS = ["experience", "projects", "contact"];

export default function SiteNav() {
  const [active, setActive] = useState<string>("top");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 120;
      const current = SECTION_IDS.filter((id) => {
        const el = document.getElementById(id);
        return el && el.offsetTop <= y;
      });
      setActive(current.at(-1) ?? "top");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => href.replace("#", "") === active;

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-border-subtle">
      <nav className="flex justify-between items-center px-6 py-4 max-w-screen-xl mx-auto">
        <a href="#top" className="font-display text-2xl font-bold text-brand tracking-tight">
          {profile.name}
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-mono text-sm tracking-wide transition-colors ${
                isActive(link.href)
                  ? "text-brand font-bold border-b-2 border-brand pb-1"
                  : "text-on-surface-variant hover:text-brand"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <a
            href={profile.github}
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface-variant hover:text-brand transition-colors"
          >
            <Icon name="code" className="text-xl" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-container text-on-primary-container px-4 py-2 font-mono text-sm rounded-lg active:scale-95 transition-transform"
          >
            Resume
          </a>
          {/* Hamburger (mobile only) */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 text-on-surface-variant"
          >
            <span className={`block h-0.5 w-6 bg-current transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-surface/95 backdrop-blur-xl">
          <div className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`font-mono text-sm py-3 border-b border-border-subtle/40 last:border-0 ${
                  isActive(link.href) ? "text-brand font-bold" : "text-on-surface-variant"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
