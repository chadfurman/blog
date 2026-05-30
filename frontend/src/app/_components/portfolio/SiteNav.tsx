"use client";

import {useEffect, useState} from "react";
import Icon from "./Icon";
import {navLinks, profile} from "@/data/portfolio";

const SECTION_IDS = ["experience", "projects", "contact"];

export default function SiteNav() {
  const [active, setActive] = useState<string>("top");

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

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-border-subtle">
      <nav className="flex justify-between items-center px-6 py-4 max-w-screen-xl mx-auto">
        <a href="#top" className="font-display text-2xl font-bold text-brand tracking-tight">
          {profile.name}
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = id === active || (id === "top" && active === "top");
            return (
              <a
                key={link.href}
                href={link.href}
                className={`font-mono text-sm tracking-wide transition-colors ${
                  isActive
                    ? "text-brand font-bold border-b-2 border-brand pb-1"
                    : "text-on-surface-variant hover:text-brand"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <a
            href={profile.github}
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface-variant hover:text-brand transition-colors"
          >
            <Icon name="code" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-container text-on-primary-container px-4 py-2 font-mono text-sm rounded-lg active:scale-95 transition-transform"
          >
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
}
