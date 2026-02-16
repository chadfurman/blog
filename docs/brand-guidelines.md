# Brand Guidelines — Chad's Website

> Living document. Last updated: 2026-02-16.
> Referenced by CLAUDE.md for consistency across all design and content work.

---

## Brand Identity

**Name:** Chad's Website
**Tagline:** WordPress & E-Commerce Solutions
**Voice:** Approachable, direct, expert. First-person ("I help..."). No corporate speak. Conversational but professional. Written for small business owners, not developers.

**Target audience:** Small business owners, solopreneurs, and online store operators who need WordPress hosting, e-commerce, and growth marketing but don't want to deal with the tech themselves.

---

## Color System

All colors are defined as space-separated RGB values in CSS custom properties for opacity support.

### Primary Palette

| Token | Value | Hex | Usage |
|---|---|---|---|
| `--background` | 255 255 255 | #FFFFFF | Page background (white) |
| `--background-alt` | 248 250 252 | #F8FAFC | Alternating section background (slate-50) |
| `--background-warm` | 240 247 255 | #F0F7FF | Warm section background (soft blue wash) |
| `--foreground` | 30 41 59 | #1E293B | Body text (slate-800) |
| `--primary` | 37 99 235 | #2563EB | Links, buttons, CTAs, accents (blue-600) |
| `--accent` | 13 148 136 | #0D9488 | Pricing, secondary accent (teal-600) |
| `--muted` | 100 116 139 | #64748B | Secondary text, captions (slate-500) |
| `--highlight` | 15 23 42 | #0F172A | Headings, emphasis (slate-900) |
| `--footer-bg` | 15 23 42 | #0F172A | Footer background (slate-900) |

### Color Usage Rules

- **Backgrounds** alternate: white -> warm -> alt -> warm to create visual rhythm between sections
- **Primary blue** is used for interactive elements only: links, buttons, focus states, active indicators
- **Accent teal** is reserved for pricing text and secondary highlights
- **Muted** is for supporting text that shouldn't compete with headings or body copy
- **Highlight (slate-900)** is for headings and strong emphasis
- Avoid pure black (#000000) — always use slate-900 or foreground
- Text on the dark footer uses white/light values

### Shadow System

| Token | Value | Usage |
|---|---|---|
| `--card-shadow` | 0 1px 3px rgba(0,0,0,0.08) | Card resting state |
| `--card-shadow-hover` | 0 8px 25px rgba(0,0,0,0.12) | Card hover state |

---

## Typography

### Font Stack

| Role | Font | Weights | Variable |
|---|---|---|---|
| **Headings** | Plus Jakarta Sans | 400, 500, 600, 700, 800 | `--font-header` |
| **Body** | Source Sans 3 | 300, 400, 500, 600 | `--font-body` |
| **Code** | SF Mono / Monaco / Inconsolata / Roboto Mono / Consolas | 400 | system monospace |

### Type Scale

| Element | Size | Weight | Tracking |
|---|---|---|---|
| h1 | text-2xl | 700 (header font default) | tracking-widest |
| h2 | text-xl | 700 | normal |
| h3 | text-base | 400 | normal |
| h4-h6 | text-base | 300 (light) | normal |
| Body | text-base | 400 | tracking-wide |
| Small/caption | text-sm | 400-500 | normal |

### Type Rules

- All headings use `--font-header` (Plus Jakarta Sans)
- All body text uses `--font-body` (Source Sans 3)
- Headings are colored with `--highlight` (slate-900)
- Body text uses `--foreground` (slate-800)
- Line height: headings use `leading-tight`, body uses `leading-7`
- Avoid font weights above 700 in body text

---

## Iconography & Imagery

### Current Icon Style

- **Line art** with dark slate (#0F172A) outlines
- **Blue (#2563EB) accent** for key visual elements within each icon
- **White background** (transparent-friendly)
- **Clean, minimal** — no fills, no gradients, no heavy shadows
- ~500x500px PNG format

### Existing Icons

| File | Description | Used For |
|---|---|---|
| `icon-wordpress-care.png` | Shield with "W" | WordPress Care service |
| `icon-ecommerce.png` | Shopping cart with upward arrow | E-Commerce service |
| `icon-growth.png` | Bar chart with rocket | Growth service |
| `icon-cta.png` | Handshake with lightbulb | CTA sections |
| `icon-starter-site.svg` | (SVG) | Starter Site service |

### Image Generation Guidelines (OpenAI / Gemini)

When generating images via AI APIs:

1. **Style consistency:** Line art with dark outlines (#0F172A or #1E293B) and blue (#2563EB) accent highlights. No fills, no gradients.
2. **Color check:** Generated images must be reviewed against the brand palette. Blue accents should match #2563EB. No orange, red, or off-brand colors.
3. **Background:** White or transparent. Never colored backgrounds.
4. **Format:** PNG for raster, SVG preferred when possible.
5. **Size:** Minimum 512x512px for icons, larger for hero/section images.
6. **Use cases:** Service icons, section decorative elements, process diagrams, feature illustrations.
7. **Avoid:** Photorealistic images, stock photo aesthetics, busy/cluttered compositions, text in images (use HTML text instead).

### Avatar

- Cartoon/chibi style illustration of Chad (glasses, beard, white shirt)
- File: `chad-no-circle.png` (primary), `chad.png` (with circle), `chad-mustache-cartoon.png` (variant)
- Used in hero section and potentially in testimonials/about sections

---

## Component Patterns

### Cards

- **Interactive cards** (`.card-interactive`): subtle shadow at rest, elevated shadow + slight `translateY(-2px)` on hover
- **Static cards** (`CardStatic`): same shadow styling but no hover effects. Used for containers (quiz, CTA, forms)
- Border radius: `rounded-lg` (0.5rem)
- Padding: `p-6` standard, `p-8 sm:p-12` for large containers

### Buttons

- **Primary CTA:** `bg-primary text-white rounded-lg px-8 py-3 font-medium tracking-wide hover:opacity-90`
- **Secondary/ghost:** `text-muted hover:text-highlight` with no background
- **Form submit:** Same as primary CTA, disabled state at `opacity-50`
- No outline/bordered button variant currently defined

### Form Inputs

- Background: `rgb(var(--background-alt))` (slate-50 tint)
- Border: `1px solid rgba(var(--foreground), 0.2)` with `3px solid rgba(var(--foreground), 0.4)` bottom
- Focus: `1px solid rgb(var(--primary))` all around + `box-shadow: 0 0 0 2px rgba(var(--primary), 0.12)`
- Hover: border lightens, bottom border turns primary blue
- Rounded corners: `rounded-lg`
- Font inherits body font family and weight

### Links

- `.link-styles`: medium weight, dotted underline, underline-offset-4, color highlight
- Hover: color shifts to primary, underline color shifts to primary
- Used in nav (`.primary-nav`) and inline within paragraphs

### Section Backgrounds

Sections alternate backgrounds to create visual rhythm:
1. White (`--background`)
2. Warm blue wash (`--background-warm`)
3. Light slate (`--background-alt`)
4. Repeat

Each section is full-width with content constrained to `max-w-screen-xl mx-auto` with `px-4 sm:px-6 lg:px-8` padding.

---

## Layout

### Grid

- Max content width: `max-w-screen-xl` (1280px)
- Service cards: `grid-cols-1 sm:grid-cols-2` (2x2 on desktop)
- Hero: `grid-cols-1 md:grid-cols-2` (text left, avatar right)
- Consistent horizontal padding: `px-4 sm:px-6 lg:px-8`

### Spacing

- Section vertical padding: `py-12` standard, `py-12 lg:py-20` for hero
- Card gaps: `gap-6` to `gap-8`
- Heading margins: `mt-8 mb-4` (defined in globals.css base layer)

### Header

- Sticky-optional (currently static)
- Logo left, nav right on desktop
- Hamburger menu (MobileNav) on mobile
- Dotted bottom border (`border-dotted border-foreground/10`)

### Footer

- Dark background (`--footer-bg`, slate-900)
- Three columns: brand info, services links, contact info
- White/light text on dark background
- Copyright line at bottom

---

## Animation & Motion (Planned)

For the services page redesign, these animation patterns are approved:

- **Fade-up on scroll:** Elements fade in and translate up slightly as they enter viewport (Intersection Observer)
- **Fly-in:** Cards or feature blocks slide in from left/right on scroll
- **Subtle parallax:** Background elements move at different scroll speeds (keep subtle, max 10-20% offset)
- **Hover transitions:** Cards lift on hover (translateY + shadow). Buttons dim slightly (opacity).
- **Tab/toggle transitions:** Smooth content swap for pricing toggle (monthly/annual)
- **Accordion:** Smooth expand/collapse for FAQ sections

**Motion rules:**
- All transitions use `ease-in-out` or `ease-out`
- Duration: 200-400ms for micro-interactions, 600-800ms for scroll reveals
- Respect `prefers-reduced-motion` — disable animations when user prefers
- No jarring animations, bounces, or spinning elements
- Performance: use `transform` and `opacity` only (GPU-accelerated properties)

---

## Content Voice

- First person singular ("I help...", "I'll set up...")
- Direct and conversational, not salesy
- Explain tech in plain English
- Pricing is transparent — always show starting prices
- Emphasize outcomes over features ("your site stays fast and secure" vs "we run daily scans")
- Use contractions (it's, you'll, don't)
- Short paragraphs, scannable headers
- No jargon without explanation

---

## Files & Structure

| Path | Purpose |
|---|---|
| `frontend/src/app/globals.css` | Color system, typography, form styles, component classes |
| `frontend/tailwind.config.ts` | Tailwind color token mapping |
| `frontend/src/app/layout.tsx` | Font loading, header, footer, global layout |
| `frontend/src/data/services.ts` | Service definitions (pricing, features, FAQs) |
| `frontend/src/data/quoteLogic.ts` | Quote explorer logic and recommendations |
| `frontend/public/` | Icons, avatar, static assets |
| `docs/brand-guidelines.md` | This file |
| `docs/plans/2026-02-16-competitive-pricing-research.md` | Market research reference |
