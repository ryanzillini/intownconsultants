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
- Tagline direction: neighborhood + craft (e.g. “Landmark brownstone renovation across Brooklyn”) — not generic “dream homes”
- Real copy sources today: Wix testimonials (home) + services page niche copy; replace placeholder photography with Lucio’s project photos as available

---

## Design Direction

**Light limestone-forward** — architectural, Brooklyn, historic craft. Not dark/gold.

- **Palette:** cool limestone and plaster backgrounds, deep iron charcoal for type, muted brownstone brick as accent (not bright terracotta or gold)
- **Typography:** expressive serif for brand + headlines; clean sans for body
- **Feel:** professional, trustworthy, high-end local craftsman — more restoration studio than flashy contractor brochure
- **Imagery:** full-bleed project / brownstone photography; stoops, façades, masonry, interiors
- **Layout:** one job per section; photo-led; mobile-first
- **Motion:** restrained (2–3 intentional moments) — presence, not noise

### Hero rules

- Brand is a hero-level signal
- First viewport: brand, one headline, one short supporting line, one CTA group, one dominant full-bleed image
- No cards, badges, stat strips, or overlay callouts on the hero

---

## Core Pages

1. **Home** — brand + niche + featured work + testimonials + CTA
2. **Services** — landmark niche, brownstones, full renovation suite
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
- Do not carry over Wix layout or dark/gold styling
