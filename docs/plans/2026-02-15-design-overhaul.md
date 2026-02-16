# Design Overhaul: Warm Professional

**Date:** 2026-02-15
**Status:** Approved
**Direction:** "Warm Professional" — trustworthy consultant who pays attention to detail

## Context

Site is in soft launch. Audience is small business owners evaluating WordPress, e-commerce, and marketing services. The site needs to feel competent, approachable, and polished — not flashy agency, not bare-bones freelancer.

Blog and Projects pages are hidden until content is ready. No testimonials until real ones are available. "Chad's Website" branding is intentional.

---

## 1. Color System

### New CSS Custom Properties

```
--background:       255 255 255     /* #FFFFFF - white */
--background-alt:   248 250 252     /* #F8FAFC - slate-50 */
--background-warm:  240 247 255     /* #F0F7FF - blue-50ish wash */
--foreground:       30 41 59        /* slate-800 */
--primary:          37 99 235       /* blue-600 */
--accent:           13 148 136      /* #0D9488 - teal-600 */
--muted:            100 116 139     /* slate-500 */
--highlight:        15 23 42        /* slate-900 */
```

### Card Tokens

```
--card-shadow:       0 1px 3px rgba(0,0,0,0.08)
--card-shadow-hover: 0 8px 25px rgba(0,0,0,0.12)
```

### Homepage Section Rhythm

| Section | Background |
|---------|-----------|
| Header | white |
| Hero | white |
| Quote Explorer | `--background-warm` |
| "What I Do" cards | `--background-alt` |
| CTA | `--background-warm` |
| Footer | slate-900 (dark) |

---

## 2. Header & Navigation

### Desktop (lg+)
- Logo/tagline left, nav links right (keep current structure)
- Nav links: switch from `justify-around` to `justify-end gap-8`
- Active page indicator: solid underline in primary color
- Remove Blog and Projects links (3 links: Home | Services | Contact)

### Mobile (<lg)
- Logo/tagline centered
- Hamburger icon at top-right (three horizontal lines)
- Tap opens slide-down panel with nav links stacked vertically
- Panel background: `--background-alt`
- Simple React state toggle, no external library
- Close on link click or second hamburger tap

---

## 3. Hero Section

### Two-Column Layout (text left, avatar right)
- **Left column (~55%):** Headline, subheadline, body copy, CTA button — left-aligned
- **Right column (~45%):** Avatar illustration, scaled to ~300-350px, vertically centered
- Swap from current layout (avatar far left, text right) to eliminate the dead-space gap
- Tighten vertical padding so hero fits above the fold at 1440x900

### Mobile
- Single column: avatar above (smaller ~150px, centered), then text below, centered

---

## 4. Service Cards

### Grid
- **Desktop:** 2x2 grid (was 3-column with orphan)
- **Tablet (md):** 2 columns
- **Mobile:** single column stack

### Card Interactions
- Resting: `box-shadow: var(--card-shadow)`, light border
- Hover: `translateY(-2px)`, `box-shadow: var(--card-shadow-hover)`, border to `primary/30`
- "Learn More >>" turns primary blue on card hover
- 200ms ease-in-out transition

### Pricing
- "Starting at $XX/mo" text uses `--accent` (teal) color for visual pop

### Fixes
- Create missing `/icon-starter-site.png` (line-art browser/webpage icon matching existing style)
- Standardize link text to "Learn More >>" everywhere (was "View Details >>" on services page)

---

## 5. Quote Explorer

- Keep only on homepage (remove from /services page)
- Wrap in `--background-warm` full-width section background
- Quiz card stays white (card-on-tinted-background contrast)
- On /services page, replace with inline CTA: "Not sure which service is right? Contact me and I'll help you figure it out."

---

## 6. CTA Section

- Full-width `--background-warm` background (bookends with quiz section)
- Larger heading size
- Button gets slightly more padding
- Keep handshake icon

---

## 7. Footer (New)

### Desktop: Three-Column on slate-900 Background

| Column 1 | Column 2 | Column 3 |
|-----------|----------|----------|
| Chad's Website | **Services** | **Get in Touch** |
| WordPress & E-Commerce Solutions | WordPress Care | Email link |
| | E-Commerce | Contact form link |
| | Growth | |
| | Starter Site | |

### Bottom Bar
`© 2026 Chad Furman. All rights reserved.`

### Mobile
Single column, centered, stacked sections.

---

## 8. Contact Page

- Add intro text above form: "Have a question or ready to get started? Fill out the form below and I'll get back to you within one business day."
- Below form: "Prefer email?" with direct email address
- Keep existing form structure

---

## 9. Typography & Spacing Fixes

### Headings
- Change `leading-3` (12px) to `leading-tight` (1.25 ratio) on all heading levels
- Reduce hero subtitle letter-spacing from `tracking-[0.35em]` to `tracking-widest` (0.1em)

### Global Transition
- Remove `* { transition: text-decoration-color 200ms }` from all elements
- Scope transitions to `.link-styles`, `button`, and card components only

### Section Spacing
- Reduce section vertical padding from ~`py-16` to `py-12`
- Tighten hero bottom padding specifically

---

## 10. Mobile Responsive

- Hamburger nav (covered in Section 2)
- Hero: single column stack, avatar above text
- Service cards: single column
- Quote explorer buttons: vertical stack
- Footer: single column centered
- Contact: already fine
