# Intown Consultants Website – Project Brief

## Overview

Modern website for **Intown Consultants Inc.**, a Brooklyn-based general contractor specializing in **landmark and brownstone renovation**.

Domain: `intowninc.com`

Owner (Lucio) needs the ability to easily add new projects, photos, and testimonials without touching code.

**Niche:** Historical / landmark renovation — brownstones across Brooklyn (Downtown Brooklyn, Williamsburg, Carroll Gardens, and surrounding neighborhoods). Full-service GC work (interior, exterior masonry, HVAC, waterproofing) supports that specialty.

---

## Tech Stack

- **Next.js 16** (App Router + TypeScript)
- **Tailwind CSS**
- **Sanity CMS** (projects, photos, testimonials, services copy)
- **Vercel** (hosting + deploys — best cost/convenience fit for Next.js; Hobby tier is enough to start)
- Domain managed in Route 53, pointed at Vercel

---

## Positioning & Messaging

- Lead with landmark / brownstone expertise, not generic remodeling
- Trust signals: 30+ years experience, licensed & insured, Lucio + crew craftsmanship
- Print headline: “Your vision is our goal”; supporting line stays landmark / brownstone craft across Brooklyn
- Real copy sources today: print brochures (About, contact, homeowner/DOB services) + Wix testimonials; replace placeholder photography with Lucio’s project photos as available

---

## Design Direction

**Official print brand** — black, gold, and paper. Logo sits on black (gold-on-black PNG; do not place on light fields).

- **Palette:** near-black (`#0a0a0a`) for chrome and dark bands, gold (`#c4a035`) for headings/CTAs/accents, bronze (`#8b6b3f`) for depth, warm paper (`#f7f4ec`) for long-form reading, white type on gold/black
- **Typography:** Playfair Display for headlines; Montserrat for body and UI
- **Logo:** `public/brand/logo.png` — gold skyline mark with INTOWN / CONSULTANTS wordmark; keep modest at large sizes until a vector exists
- **Feel:** high-end residential construction; brochure language translated for web, not a 1:1 print paste
- **Imagery:** full-bleed interiors and façades; honeycomb (`clip-path`) as a featured-work accent on desktop
- **Layout:** color-blocked sections (black / gold / paper); sharp diagonal on the hero; mobile-first
- **Motion:** restrained (2–3 intentional moments) — presence, not noise

### Hero rules

- Brand is a hero-level signal (official logo in the black diagonal cut)
- First viewport: logo, “Your vision is our goal,” one short supporting line, one CTA group, one dominant full-bleed image
- Geometric diagonal is the one overlay; no cards, badges, or stat strips

---

## Core Pages

1. **Home** — brand + about + honeycomb work + homeowner service + testimonials + CTA
2. **Services** — landmark niche, brownstones, DOB/regulatory, inspections, full renovation suite
3. **Projects** — main portfolio, filterable (Sanity-driven)
4. **About** — Lucio, experience, licensing
5. **Contact / Get a Quote** — form (Resend) + contact details

---

## Content Model (Sanity)

- `project` — title, neighborhood, category, gallery, description, featured
- `testimonial` — quote, name, optional project ref
- `service` — title, summary, body, optional image
- `siteSettings` — phone, email, address, tagline

---

## Recommended Folder Structure

```
app/
  layout.tsx
  page.tsx                 # Home
  globals.css
  services/page.tsx
  projects/
    page.tsx
    [slug]/page.tsx
  about/page.tsx
  contact/page.tsx
  studio/[[...tool]]/page.tsx   # Sanity Studio
components/
  layout/                  # Header, Footer
  home/                    # Home sections
  projects/
  ui/                      # Shared primitives
lib/
  sanity/                  # Client, queries, image helpers
  utils.ts
sanity/
  schemaTypes/
  sanity.config.ts
```

---

## Source Reference (current Wix)

- URL: https://ryanzillini.wixsite.com/my-site-1
- Use only: home testimonials + services page text/niche framing
- Visual system follows the official print brochures (black/gold), not the Wix layout
