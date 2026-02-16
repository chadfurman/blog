# Design Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the site from "unfinished minimal" to "Warm Professional" — alternating section backgrounds, card hover states, mobile nav, footer, bug fixes, and typography polish.

**Architecture:** All changes are frontend-only. Modify CSS custom properties, Tailwind config, and React components. No backend changes. No new dependencies except a simple SVG icon.

**Tech Stack:** Next.js 15, Tailwind CSS, React, TypeScript

**Design doc:** `docs/plans/2026-02-15-design-overhaul.md`

---

### Task 1: Color System & Tailwind Config

Update the CSS custom properties and Tailwind config to add new color tokens needed by all subsequent tasks.

**Files:**
- Modify: `frontend/src/app/globals.css:70-78` (`:root` block)
- Modify: `frontend/tailwind.config.ts:11-18` (colors extend)

**Step 1: Add new CSS custom properties**

In `frontend/src/app/globals.css`, replace the `:root` block (lines 70-78) with:

```css
:root {
    --background: 255 255 255;       /* #FFFFFF - white */
    --background-alt: 248 250 252;   /* #F8FAFC - slate-50 */
    --background-warm: 240 247 255;  /* #F0F7FF - soft blue wash */
    --foreground: 30 41 59;          /* slate-800 */
    --primary: 37 99 235;            /* blue-600 */
    --accent: 13 148 136;            /* #0D9488 - teal-600 */
    --muted: 100 116 139;            /* slate-500 */
    --highlight: 15 23 42;           /* slate-900 */
    --header-font-weight: 700;
    --body-font-weight: 400;
    --card-shadow: 0 1px 3px rgba(0,0,0,0.08);
    --card-shadow-hover: 0 8px 25px rgba(0,0,0,0.12);
    --footer-bg: 15 23 42;          /* slate-900 */
}
```

**Step 2: Add new colors to Tailwind config**

In `frontend/tailwind.config.ts`, update the `colors` extend block:

```ts
colors: {
    background: "rgb(var(--background))",
    "background-alt": "rgb(var(--background-alt))",
    "background-warm": "rgb(var(--background-warm))",
    foreground: "rgb(var(--foreground))",
    primary: "rgb(var(--primary))",
    accent: "rgb(var(--accent))",
    muted: "rgb(var(--muted))",
    highlight: "rgb(var(--highlight))",
    "footer-bg": "rgb(var(--footer-bg))",
    transparent: 'transparent',
    current: 'currentColor',
},
```

**Step 3: Verify the dev server still runs**

Run: `cd frontend && npm run dev` — confirm no build errors, homepage loads.

**Step 4: Commit**

```bash
git add frontend/src/app/globals.css frontend/tailwind.config.ts
git commit -m "feat: add color system tokens for design overhaul"
```

---

### Task 2: Typography & Global CSS Fixes

Fix dangerously tight heading line-height, over-broad transition rule, and heading letter-spacing.

**Files:**
- Modify: `frontend/src/app/globals.css:4-65` (heading styles in `@layer base`)
- Modify: `frontend/src/app/globals.css:80-86` (`*` selector)

**Step 1: Fix heading line-heights**

In `frontend/src/app/globals.css`, change `leading-3` to `leading-tight` for all heading levels (h1-h6). The `leading-3` value is 0.75rem which breaks on multi-line headings. `leading-tight` is a 1.25 ratio.

Replace every occurrence of `@apply leading-3;` inside the `@layer base` block with `@apply leading-tight;`. There are 6 occurrences (h1 through h6).

**Step 2: Scope the global transition rule**

Replace lines 80-86 (the `*, *::before, *::after` rule):

```css
*, *::before, *::after {
    box-sizing: border-box;
}
```

Remove the `@apply duration-200; @apply ease-in-out; transition-property: text-decoration-color;` from the universal selector. These transitions are already applied where needed via `.link-styles` and individual component classes.

**Step 3: Verify visually**

Reload the site. Headings should have slightly more breathing room. No transition artifacts on random elements.

**Step 4: Commit**

```bash
git add frontend/src/app/globals.css
git commit -m "fix: heading line-heights and scope transition rules"
```

---

### Task 3: Card Component Hover States

Update the Card component to use the new shadow tokens and improve hover feedback.

**Files:**
- Modify: `frontend/src/app/_components/Card.tsx:10-16` (Card component)
- Modify: `frontend/src/app/_components/Card.tsx:22-28` (CardStatic component)

**Step 1: Update Card (interactive) className**

Replace the Card component's className (line 15):

```tsx
className={`rounded-xl border border-foreground/10 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 ${className}`}
```

And add inline style for shadows since Tailwind doesn't directly support CSS custom property shadows cleanly:

```tsx
style={{
    boxShadow: "var(--card-shadow)",
    ...style,
}}
```

Add an `onMouseEnter`/`onMouseLeave` approach OR use a CSS class approach. Simplest: add a CSS class `.card-interactive` in globals.css:

```css
.card-interactive {
    box-shadow: var(--card-shadow);
    transition: box-shadow 200ms ease-in-out, transform 200ms ease-in-out, border-color 200ms ease-in-out;
}
.card-interactive:hover {
    box-shadow: var(--card-shadow-hover);
}
```

Then update Card component:

```tsx
export function Card({ children, className = "", id, style }: CardProps) {
  return (
    <div
      id={id}
      style={style}
      className={`card-interactive rounded-xl border border-foreground/10 bg-white p-5 text-center hover:-translate-y-1 hover:border-primary/30 ${className}`}
    >
      {children}
    </div>
  );
}
```

**Step 2: Update CardStatic — subtle shadow, no hover**

```tsx
export function CardStatic({ children, className = "", id, style }: CardProps) {
  return (
    <div
      id={id}
      style={style}
      className={`rounded-xl border border-foreground/10 bg-white p-5 text-center ${className}`}
    >
      {children}
    </div>
  );
}
```

Note: CardStatic intentionally has no shadow and no hover — it's for containers like the quiz widget and CTA that shouldn't feel clickable.

**Step 3: Add `.card-interactive` styles to globals.css**

Add after the existing `.link-styles` rules (around line 148):

```css
.card-interactive {
    box-shadow: var(--card-shadow);
    transition: box-shadow 200ms ease-in-out, transform 200ms ease-in-out, border-color 200ms ease-in-out;
}
.card-interactive:hover {
    box-shadow: var(--card-shadow-hover);
}
```

**Step 4: Verify visually**

Hover over service cards on homepage — should see shadow deepen and card lift subtly. Cards on CTA/quiz should NOT have hover effects.

**Step 5: Commit**

```bash
git add frontend/src/app/_components/Card.tsx frontend/src/app/globals.css
git commit -m "feat: add card hover states with shadow tokens"
```

---

### Task 4: Fix Broken Starter Site Icon

The Starter Site service card references `/icon-starter-site.png` which doesn't exist.

**Files:**
- Create: `frontend/public/icon-starter-site.png`

**Step 1: Create the icon**

Create an SVG of a simple browser/webpage outline icon matching the line-art style of the other three icons (wordpress shield, shopping cart, growth chart). Convert to PNG at same dimensions as other icons.

The simplest approach: create an SVG inline and use a tool to convert, OR create it as an SVG and update the service data to reference `.svg` instead. Since the other icons are PNG, create a PNG.

Use a simple approach — create an SVG file first:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2">
  <rect x="8" y="12" width="64" height="52" rx="4" />
  <line x1="8" y1="24" x2="72" y2="24" />
  <circle cx="16" cy="18" r="2" fill="#ef4444" stroke="none" />
  <circle cx="24" cy="18" r="2" fill="#eab308" stroke="none" />
  <circle cx="32" cy="18" r="2" fill="#22c55e" stroke="none" />
  <rect x="16" y="32" width="20" height="4" rx="1" fill="#1e293b" stroke="none" />
  <rect x="16" y="40" width="48" height="2" rx="1" fill="#94a3b8" stroke="none" />
  <rect x="16" y="46" width="48" height="2" rx="1" fill="#94a3b8" stroke="none" />
  <rect x="16" y="52" width="32" height="2" rx="1" fill="#94a3b8" stroke="none" />
</svg>
```

Save as SVG first, then convert to PNG using the project's image pipeline (or use `sharp`/`sips` on macOS):

```bash
# If sips doesn't handle SVG, use the SVG directly and update services.ts
# Alternative: just save as SVG and reference it as an <img> tag
```

Pragmatic option: save as SVG at `frontend/public/icon-starter-site.svg` and update `services.ts` line 145 to reference `/icon-starter-site.svg`. The `ExportedImage` component can handle SVGs. OR convert using a quick script.

**Step 2: Verify the icon renders**

Reload homepage, scroll to the Starter Site card. Should show a browser window icon instead of broken alt text.

**Step 3: Commit**

```bash
git add frontend/public/icon-starter-site.* frontend/src/data/services.ts
git commit -m "fix: add missing Starter Site icon"
```

---

### Task 5: Header Redesign & Mobile Nav

Major change: add hamburger menu for mobile, tighten desktop nav spacing, remove Blog/Projects links.

**Files:**
- Modify: `frontend/src/app/layout.tsx:41-56` (header/nav markup)
- Create: `frontend/src/app/_components/MobileNav.tsx` (client component for hamburger toggle)

**Step 1: Create MobileNav client component**

Create `frontend/src/app/_components/MobileNav.tsx`:

```tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`link-styles text-lg ${
                  pathname === link.href ? "text-primary !decoration-solid !decoration-primary" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
```

**Step 2: Update layout.tsx header**

Replace the header in `frontend/src/app/layout.tsx` (lines 41-56):

```tsx
<header className="relative lg:grid lg:grid-rows-1 lg:grid-cols-3 py-4 border-b border-dotted border-foreground/10 items-center px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
  <div className="col-span-1 flex items-center justify-between lg:justify-start">
    <Link href="/">
      <h1 className="m-0 hover:text-primary">Chad&apos;s Website</h1>
      <h2 className="m-0 text-sm tracking-[0.35em]">WordPress &amp; E-Commerce Solutions</h2>
    </Link>
    <MobileNav />
  </div>
  <nav className="primary-nav col-span-2 hidden lg:flex flex-row justify-end gap-8 items-center">
    <NavLink href="/">Home</NavLink>
    <NavLink href="/services">Services</NavLink>
    <NavLink href="/contact">Contact</NavLink>
  </nav>
</header>
```

Create a small `NavLink` helper (can be inline in layout.tsx or a separate file). Since layout.tsx is a server component, the active-state highlighting needs a client component. Simplest approach: make nav links use `.link-styles` as-is (they already do), and add active state in a client wrapper.

Alternative simpler approach: skip active state for now (current site doesn't have it either) and just do the structural changes. Active state can be a follow-up.

Add the import at top of layout.tsx:
```tsx
import MobileNav from "@/app/_components/MobileNav";
```

**Step 3: Verify**

- Desktop (lg+): three nav links (Home, Services, Contact) grouped right with gap-8
- Resize to < 1024px: hamburger icon appears, nav links hidden, tapping hamburger reveals slide-down panel
- Blog and Projects links gone from both desktop and mobile

**Step 4: Commit**

```bash
git add frontend/src/app/_components/MobileNav.tsx frontend/src/app/layout.tsx
git commit -m "feat: add mobile hamburger nav, remove Blog/Projects links"
```

---

### Task 6: Hero Section — Text Left, Avatar Right

Swap the hero columns so text is on the left (natural reading position) and avatar on the right.

**Files:**
- Modify: `frontend/src/app/page.tsx:25-57` (Hero component)

**Step 1: Rewrite the Hero component**

Replace the Hero function in `frontend/src/app/page.tsx`:

```tsx
function Hero() {
  return (
    <div className="py-12 lg:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="order-2 md:order-1">
        <h2 className="my-2 tracking-[.1em] text-3xl md:text-4xl lg:text-7xl">
          Hi! I&apos;m Chad.
        </h2>
        <h3 className="my-2 text-highlight/90 text-xl md:text-2xl lg:text-4xl tracking-[.1em]">
          I help small businesses grow online.
        </h3>
        <p className="leading-7 mt-4 mb-6 max-w-lg">
          Fast, secure WordPress sites. Smart email marketing. E-commerce that
          converts. I handle the tech so you can focus on your business.
        </p>
        <div>
          <Link
            href="/services"
            className="inline-block rounded-lg px-8 py-3 font-medium tracking-wide bg-primary text-white hover:opacity-90 transition-opacity"
          >
            See My Services
          </Link>
        </div>
      </div>
      <div className="order-1 md:order-2 flex justify-center">
        <div className="relative w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px]">
          <ExportedImage
            alt="Chad Furman"
            src={ChadImage}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
```

Key changes:
- Grid is now `md:grid-cols-2` (two columns from medium up)
- Text column is `order-2 md:order-1` (shows second on mobile, first on desktop)
- Avatar column is `order-1 md:order-2` (shows first on mobile, second on desktop)
- Avatar has explicit sizing instead of `fill` with min-height hack
- Vertical padding tightened from `py-16 lg:py-24` to `py-12 lg:py-20`
- Removed `sm:` prefixed centering classes — text is left-aligned on all sizes, avatar centered on mobile
- Removed `grid-flow-dense` and `col-start` hacks

**Step 2: Verify visually**

- Desktop: text left, avatar right, both above the fold
- Mobile: avatar centered on top, text below

**Step 3: Commit**

```bash
git add frontend/src/app/page.tsx
git commit -m "feat: hero layout — text left, avatar right"
```

---

### Task 7: Homepage Section Backgrounds

Apply the alternating background rhythm. This requires wrapping sections in full-width background containers that break out of the `max-w-screen-xl` content container.

**Files:**
- Modify: `frontend/src/app/page.tsx:60-173` (section wrappers)
- Modify: `frontend/src/app/layout.tsx:57` (main element padding)

**Step 1: Adjust the layout.tsx main element**

The current `<main>` has `px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto`. For full-width section backgrounds, the sections themselves need to be full-width, with inner content constrained.

Two approaches:
- A) Remove max-width from `<main>`, add it to each section's inner content
- B) Use negative margin + padding trick to break out of container

Approach A is cleaner. Update the `<main>` in layout.tsx:

```tsx
<main className="min-h-screen">
  {children}
</main>
```

Then each page's content sections get their own container constraints.

**Step 2: Update homepage sections with background wrappers**

Replace the Home component in `page.tsx`:

```tsx
export default async function Home() {
  return (
    <div>
      {/* Hero - white background */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <Hero />
      </div>

      {/* Quote Explorer - warm background */}
      <div className="bg-background-warm">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
          <QuoteSection />
        </div>
      </div>

      {/* Service Highlights - alt background */}
      <div className="bg-background-alt">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
          <ServiceHighlights />
        </div>
      </div>

      {/* CTA - warm background */}
      <div className="bg-background-warm">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
          <CTASection
            headline="Ready to grow your business?"
            description="Let's talk about what you need — whether it's a new WordPress site, better SEO, or email marketing that actually converts."
            linkText="Contact Me"
            linkHref="/contact"
          />
        </div>
      </div>
    </div>
  );
}
```

Remove the `<FeaturedProjects />` and `<BlogHighlights />` calls since Blog/Projects are hidden. Also remove unused imports (`PostType`, `getPosts`, `getProjects`, `ProjectType`) and the `Post`, `FeaturedProject`, `FeaturedProjects`, `BlogHighlights`, `HorizontalScrollList` functions since they're no longer rendered.

**Step 3: Update other pages to include their own padding**

Since `<main>` no longer has padding, other pages need their own content wrapper. Update:

- `frontend/src/app/services/page.tsx`: wrap content in `<div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">`
- `frontend/src/app/services/[slug]/page.tsx`: same wrapper
- `frontend/src/app/contact/page.tsx`: same wrapper
- `frontend/src/app/posts/page.tsx`: same wrapper
- `frontend/src/app/projects/page.tsx`: same wrapper

**Step 4: Verify**

Homepage should show alternating backgrounds: white → soft blue → light gray → soft blue. Each section should have its content properly constrained within the max-width container.

**Step 5: Commit**

```bash
git add frontend/src/app/page.tsx frontend/src/app/layout.tsx frontend/src/app/services/page.tsx frontend/src/app/services/\[slug\]/page.tsx frontend/src/app/contact/page.tsx frontend/src/app/posts/page.tsx frontend/src/app/projects/page.tsx
git commit -m "feat: alternating section backgrounds on homepage"
```

---

### Task 8: Service Cards — 2x2 Grid & Pricing Accent

Change from 3-column to 2-column grid and add teal accent to pricing.

**Files:**
- Modify: `frontend/src/app/page.tsx` (ServiceHighlights grid class)
- Modify: `frontend/src/app/_components/ServiceCard.tsx:31` (pricing color)
- Modify: `frontend/src/app/_components/ServiceCard.tsx:35` ("Learn More" text)
- Modify: `frontend/src/app/_components/ServiceCard.tsx:60` (pricing color in FullCard)
- Modify: `frontend/src/app/_components/ServiceCard.tsx:80` ("View Details" → "Learn More")
- Modify: `frontend/src/app/services/page.tsx:36` (services page grid)

**Step 1: Update homepage grid**

In `page.tsx` ServiceHighlights, change `lg:grid-cols-3` to `sm:grid-cols-2`:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
```

**Step 2: Update pricing color in SummaryCard**

In `ServiceCard.tsx`, SummaryCard pricing line (around line 31):

```tsx
<p className="text-sm font-medium !mb-1 text-accent">{service.startingAt}</p>
```

**Step 3: Standardize "Learn More" text in SummaryCard**

Already says "Learn More >>". No change needed.

**Step 4: Update pricing color in FullCard**

In `ServiceCard.tsx`, FullCard pricing (around line 60):

```tsx
<p className="font-medium !mb-1 text-accent">{service.startingAt}</p>
```

**Step 5: Change "View Details" to "Learn More" in FullCard**

In `ServiceCard.tsx` line 80:

```tsx
<span className="link-styles">Learn More &gt;&gt;</span>
```

**Step 6: Update services page grid**

In `services/page.tsx` line 36, change `md:grid-cols-3` to `md:grid-cols-2`:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
```

**Step 7: Verify**

- Homepage: 4 service cards in a 2x2 grid on desktop, all same size
- Services page: service cards in 2-column grid
- Pricing shows in teal
- All cards say "Learn More >>"

**Step 8: Commit**

```bash
git add frontend/src/app/page.tsx frontend/src/app/_components/ServiceCard.tsx frontend/src/app/services/page.tsx
git commit -m "feat: 2x2 service grid with teal pricing accent"
```

---

### Task 9: Services Page — Remove Quiz, Add Inline CTA

Remove the duplicated QuoteExplorer from the services page and replace with a simpler inline CTA.

**Files:**
- Modify: `frontend/src/app/services/page.tsx:2-6` (imports)
- Modify: `frontend/src/app/services/page.tsx:26-32` (quiz section)

**Step 1: Remove QuoteExplorer import and section**

In `frontend/src/app/services/page.tsx`:

Remove the `QuoteExplorer` import (line 4).

Replace the quiz section (lines 26-32) with an inline CTA:

```tsx
<section className="my-12 text-center">
  <p className="text-muted max-w-lg mx-auto">
    Not sure which service is right?{" "}
    <a href="/contact" className="link-styles">Contact me</a>{" "}
    and I&apos;ll help you figure it out.
  </p>
</section>
```

**Step 2: Verify**

Services page should no longer show the step-by-step quiz. Instead, a simple one-liner with a contact link.

**Step 3: Commit**

```bash
git add frontend/src/app/services/page.tsx
git commit -m "refactor: replace quiz with inline CTA on services page"
```

---

### Task 10: CTA Section Styling

Update the CTA component to work with the full-width background approach and slightly increase visual weight.

**Files:**
- Modify: `frontend/src/app/_components/CTASection.tsx`

**Step 1: Update CTASection**

The CTA section no longer needs its own `my-16` margin since the parent wrapper handles the background. Update:

```tsx
export default function CTASection({
  headline,
  description,
  linkText,
  linkHref,
}: CTASectionProps) {
  return (
    <section className="py-12">
      <CardStatic className="p-10 sm:p-16 text-center">
        <div className="flex justify-center mb-6">
          <ExportedImage
            src="/icon-cta.png"
            alt=""
            width={96}
            height={96}
            className="object-contain opacity-80"
          />
        </div>
        <h2 className="!mt-0 text-2xl">{headline}</h2>
        <p className="max-w-xl mx-auto mb-8 leading-relaxed">{description}</p>
        <Link
          href={linkHref}
          className="inline-block rounded-lg px-10 py-4 font-medium tracking-wide bg-primary text-white hover:opacity-90 transition-opacity text-lg"
        >
          {linkText}
        </Link>
      </CardStatic>
    </section>
  );
}
```

Changes: `my-16` → `py-12`, heading gets `text-2xl`, button gets `px-10 py-4 text-lg`, body gets `leading-relaxed`.

**Step 2: Verify**

CTA section should feel slightly larger/more prominent. Button is bigger.

**Step 3: Commit**

```bash
git add frontend/src/app/_components/CTASection.tsx
git commit -m "feat: increase CTA section visual weight"
```

---

### Task 11: Section Spacing Reduction

Tighten vertical spacing in homepage sections and the quote section.

**Files:**
- Modify: `frontend/src/app/page.tsx` (QuoteSection and ServiceHighlights `my-` classes)

**Step 1: Update section margins**

In `page.tsx`, change QuoteSection:

```tsx
function QuoteSection() {
  return (
    <section className="py-12">
      ...
    </section>
  );
}
```

Change `my-16` → `py-12` (since the parent div now handles background, use padding not margin).

Change ServiceHighlights similarly:

```tsx
function ServiceHighlights() {
  return (
    <section className="py-12">
      ...
    </section>
  );
}
```

**Step 2: Verify**

Less dead space between sections on homepage. Page should feel more cohesive.

**Step 3: Commit**

```bash
git add frontend/src/app/page.tsx
git commit -m "feat: tighten section vertical spacing"
```

---

### Task 12: Footer Component

Create the site footer with three-column layout on dark background.

**Files:**
- Create: `frontend/src/app/_components/Footer.tsx`
- Modify: `frontend/src/app/layout.tsx` (add Footer below main)

**Step 1: Create Footer component**

Create `frontend/src/app/_components/Footer.tsx`:

```tsx
import Link from "next/link";
import { services } from "@/data/services";

export default function Footer() {
  return (
    <footer className="bg-footer-bg text-slate-300">
      <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand */}
          <div>
            <h3 className="!mt-0 !mb-2 text-white !text-lg">Chad&apos;s Website</h3>
            <p className="text-sm text-slate-400 !my-0">WordPress &amp; E-Commerce Solutions</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="!mt-0 !mb-3 text-white !text-sm font-semibold uppercase tracking-wider">Services</h4>
            <ul className="!p-0 !m-0 list-none space-y-2">
              {services.map((service) => (
                <li key={service.id} className="!m-0">
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-slate-400 hover:text-white transition-colors no-underline"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="!mt-0 !mb-3 text-white !text-sm font-semibold uppercase tracking-wider">Get in Touch</h4>
            <ul className="!p-0 !m-0 list-none space-y-2">
              <li className="!m-0">
                <Link
                  href="/contact"
                  className="text-sm text-slate-400 hover:text-white transition-colors no-underline"
                >
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-700">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto py-4 text-center">
          <p className="text-xs text-slate-500 !my-0">&copy; 2026 Chad Furman. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Add Footer to layout.tsx**

In `frontend/src/app/layout.tsx`, add import:

```tsx
import Footer from "@/app/_components/Footer";
```

Add `<Footer />` after `</main>` and before `<PrismLoader />`:

```tsx
</main>
<Footer />
<PrismLoader />
```

**Step 3: Verify**

Dark footer appears at the bottom of every page. Three columns on desktop, stacked on mobile. Links work.

**Step 4: Commit**

```bash
git add frontend/src/app/_components/Footer.tsx frontend/src/app/layout.tsx
git commit -m "feat: add site footer with dark background"
```

---

### Task 13: Contact Page Enhancement

Add intro copy and email fallback below the form.

**Files:**
- Modify: `frontend/src/app/contact/page.tsx`
- Modify: `frontend/src/app/_components/ContactForm.tsx:77-79` (subtitle text)

**Step 1: Update ContactForm subtitle**

In `ContactForm.tsx`, update the subtitle paragraph (line 78):

```tsx
<p className="text-center text-muted">
  Fill out the form below and I&apos;ll get back to you within one business day.
</p>
```

**Step 2: Add email fallback below the form**

In `ContactForm.tsx`, after the closing `</CardStatic>` tag (around line 149), before the final `);`, add:

```tsx
<p className="text-center text-sm text-muted mt-4">
  Prefer email? Reach me directly at{" "}
  <a href="mailto:chad@chadfurman.com" className="link-styles">chad@chadfurman.com</a>
</p>
```

Note: Replace `chad@chadfurman.com` with the actual preferred email. If unsure, use a placeholder and flag it for the user to update.

**Step 3: Wrap return in fragment if needed**

Since ContactForm currently returns a single `<CardStatic>`, adding a paragraph below means we need a fragment wrapper:

```tsx
return (
  <>
    <CardStatic className="p-8 sm:p-12 my-12 max-w-2xl mx-auto">
      {/* ... existing form content ... */}
    </CardStatic>
    <p className="text-center text-sm text-muted mt-4 mb-12">
      Prefer email? Reach me directly at{" "}
      <a href="mailto:chad@chadfurman.com" className="link-styles">chad@chadfurman.com</a>
    </p>
  </>
);
```

Apply the same fragment pattern to the submitted state return.

**Step 4: Verify**

Contact page shows updated subtitle and email fallback below form.

**Step 5: Commit**

```bash
git add frontend/src/app/_components/ContactForm.tsx
git commit -m "feat: enhance contact page with response time and email fallback"
```

---

### Task 14: Services Page Section Backgrounds

Apply background rhythm to the services page similar to homepage.

**Files:**
- Modify: `frontend/src/app/services/page.tsx`

**Step 1: Wrap services page sections with backgrounds**

```tsx
export default function ServicesPage() {
  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <section className="text-center my-12">
          <h1>Services</h1>
          <p className="max-w-2xl mx-auto text-muted">
            I help small businesses and online stores grow with fast, secure
            WordPress sites, e-commerce that converts, and marketing that drives
            real results. Every engagement starts with a conversation.
          </p>
        </section>

        <section className="my-12 text-center">
          <p className="text-muted max-w-lg mx-auto">
            Not sure which service is right?{" "}
            <a href="/contact" className="link-styles">Contact me</a>{" "}
            and I&apos;ll help you figure it out.
          </p>
        </section>
      </div>

      <div className="bg-background-alt">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
          <section className="py-12">
            <h2 className="text-center">All Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} variant="full" />
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <section className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <CardStatic className="p-6">
            <h3 className="!mt-0 !mb-2">Need a new site?</h3>
            <p className="text-sm text-muted">
              Starter WordPress sites from $300 when paired with a care plan.
              Custom designs and complex builds scoped individually.
            </p>
          </CardStatic>
          <CardStatic className="p-6">
            <h3 className="!mt-0 !mb-2">Shopify?</h3>
            <p className="text-sm text-muted">
              Shopify setup and customization options available. Let&apos;s talk
              about what works best for your store.
            </p>
          </CardStatic>
        </section>
      </div>

      <div className="bg-background-warm">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
          <CTASection
            headline="Ready to get started?"
            description="Tell me about your project and I'll put together a plan that fits your goals and budget."
            linkText="Contact Me"
            linkHref="/contact"
          />
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify**

Services page has alternating section backgrounds matching homepage rhythm.

**Step 3: Commit**

```bash
git add frontend/src/app/services/page.tsx
git commit -m "feat: add section backgrounds to services page"
```

---

### Task 15: Final Polish & Visual QA

Manual visual review and any remaining tweaks.

**Files:**
- Possibly touch any file from previous tasks for minor adjustments

**Step 1: Run build to catch any errors**

```bash
cd frontend && npm run build
```

Fix any TypeScript or build errors.

**Step 2: Visual QA checklist**

Open `http://localhost:3001` and verify each page:

- [ ] Homepage: hero (text left, avatar right), alternating backgrounds, 2x2 service cards with hover, CTA section
- [ ] Homepage: Starter Site card shows icon (no broken image)
- [ ] Homepage: quiz section on warm background
- [ ] Services page: no quiz, inline CTA, 2-column card grid, section backgrounds
- [ ] Services detail page: renders correctly with padding
- [ ] Contact page: updated copy, email fallback
- [ ] Footer: appears on all pages, three columns desktop, stacked mobile
- [ ] Mobile (resize to 375px): hamburger nav works, hero stacks properly, cards single column, footer stacked
- [ ] No Blog or Projects links in nav
- [ ] Service card pricing shows teal
- [ ] Card hover: lift + shadow deepening
- [ ] No broken transitions on page load

**Step 3: Fix any issues found in QA**

Address visual issues as they come up.

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: visual QA fixes and polish"
```

---

## Task Summary

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1 | Color system & Tailwind config | globals.css, tailwind.config.ts | — |
| 2 | Typography & global CSS fixes | globals.css | 1 |
| 3 | Card hover states | Card.tsx, globals.css | 1 |
| 4 | Fix Starter Site icon | public/icon-starter-site.*, services.ts | — |
| 5 | Header & mobile nav | layout.tsx, MobileNav.tsx | 1 |
| 6 | Hero text-left avatar-right | page.tsx | — |
| 7 | Homepage section backgrounds | page.tsx, layout.tsx, all page files | 1, 6 |
| 8 | Service cards 2x2 + teal pricing | page.tsx, ServiceCard.tsx, services/page.tsx | 1, 3 |
| 9 | Services page remove quiz | services/page.tsx | — |
| 10 | CTA section styling | CTASection.tsx | 7 |
| 11 | Section spacing reduction | page.tsx | 7 |
| 12 | Footer component | Footer.tsx, layout.tsx | 1 |
| 13 | Contact page enhancement | ContactForm.tsx | — |
| 14 | Services page backgrounds | services/page.tsx | 7, 9 |
| 15 | Final polish & visual QA | any | all |
