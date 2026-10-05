# Khunwin Mae Wang Digital Storytelling Site: Design

Date: 2026-10-05
Source requirement: "Requirement Document – เว็บไซต์ Digital Storytelling ชุมชนขุนวินแม่วาง" (Oct 5, 2026)
Visual reference: Stitch project "Elephant Craft Product Showcase" (`projects/12359152992775504546`) for layout and sections only.

## 1. Purpose

A showcase and storytelling website for Khunwin Mae Wang community products. It helps people outside the area find the products, see the story, materials and makers behind them, and contact the community through LINE or Facebook in one click. It is not an e-commerce site: no cart, no payment, no stock counting, no customer accounts.

Primary success metric: clicks on the LINE and Facebook contact buttons.

## 2. Decisions made

| Topic | Decision |
|---|---|
| Stack | Vite + React + TypeScript, `react-router`, `@supabase/supabase-js`. Static build deployed on Vercel. |
| Database | Existing Supabase project "Khunwin Meawang" (`orqkvfyvhuvchbtbclna`), extended by one additive migration. |
| Back office | `/admin` inside the same app, Supabase Auth email login for staff only, Thai forms. |
| Theme | Vintage Collage as the requirement document specifies. Stitch design provides layout and sections only. |
| Language | Thai only for v1. English columns (`*_en`) are a later addition. |
| Hero | Looping muted video background. A placeholder clip is used during development and replaced by real community footage before launch. |
| Checkpoints | `git add`, `git commit`, `git push` after every build step. |

Deviation from the document: its non-functional section suggests no-code tools (Framer, Webflow, WordPress). This design keeps React and Supabase and satisfies "easy for the community to maintain" with the `/admin` back office.

## 3. Scope

In scope for v1:
- Five public pages: Home (story scroll), Products (list and detail), Our Story, Visit, Contact.
- Sticky contact button on every page that sends the product name in the LINE message.
- Admin: login, product list, edit form for price, availability and photos.
- GA4 events and a PDPA cookie banner.
- SEO basics (Thai titles and meta descriptions).

Out of scope for v1: English language, cart or payment, stock system, customer accounts, online booking, mobile app, admin editing of stories, materials, processes, artisans, elephants and channels.

## 4. Architecture

One single-page app with no server code. Pages read from Supabase with the anon key, which is public by design. Row level security is the protection. Joins happen inside the query. There is no client cache layer.

Public routes:
- `/` Home story scroll
- `/products` and `/products/:id`
- `/our-story`
- `/visit`
- `/contact`
- `/p/:qr_code` redirects to the matching product page, for QR tags on physical products

Admin routes:
- `/admin` login
- `/admin/products` list and edit form

Staff accounts are created manually in Supabase Auth. There is no public signup.

Environment variables on Vercel: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GA_ID`, `VITE_LINE_OA_ID`.

## 5. Data model changes (one migration)

Existing tables are kept: `products`, `stories`, `materials`, `processes`, `artisans`, `elephants`, `media`, `purchase_channels`, and the join tables `product_materials`, `product_processes`, `product_artisans`, `product_elephants`, `product_purchase_channels`.

Additions:
- `products.reference_price` numeric, nullable. Reference price (ราคาอ้างอิง).
- `products.availability` text, check in (`ready`, `made_to_order`), default `made_to_order`. Replaces stock counting.
- `product_images` table: `id`, `product_id`, `url`, `display_order`. Multiple angles per product.
- `visit_info` table for the Visit page: activities, opening times, map link, directions. Final columns are fixed in the implementation plan.
- RLS: anonymous `SELECT` on content tables. Writes only for authenticated admins.
- Remove the duplicate link `products.story_id`. `stories.product_id` remains the single source.
- Supabase Storage bucket for product photos. Public read, authenticated write.

## 6. Pages and components

### Home (story scroll)
Five full-screen chapters joined by one thread line that draws as the visitor scrolls.
1. Hero: video background, community name, opening line.
2. Where Khunwin Mae Wang is: wide landscape and village imagery.
3. People and wisdom: black and white portraits.
4. Nature to craft: materials and process steps from `product_materials` and `product_processes` ordered by `step_order`, plus a short clip.
5. Living Artifacts: three to four featured products, then links to Products and Visit.

Chapter text is at most 40 words. Chapters 1, 2 and 5 copy is static because no table holds it. Chapters 3 and 4 read from the database.

### Products
- List: card with image, name, reference price, material badges, availability badge, Inquire button. Category filter (`ayara`, `ecoprint`) is a Should.
- Detail: story (introduction, origin, value), process steps, artisans, elephants, image gallery, purchase channels from `product_purchase_channels`.

### Our Story, Visit, Contact
- Our Story: long-form text.
- Visit: Google Maps embed, directions, activities and opening times from `visit_info`.
- Contact: LINE OA, Facebook Messenger, phone, QR code.

### Shared components
`Layout`, `StickyContact`, `ThreadLine`, `CollageLayer`, `ProductCard`, `CookieBanner`.

### Admin
Product list and an edit form for price, availability, text fields and photo upload.

## 7. Visual design

Palette from the requirement document: paper cream `#F5F0E6`, earth brown `#8B6A4A`, forest green `#3F5A3C`, charcoal `#2B2B2B`, brass accent `#C9A24B`. Headline font with a handmade Thai feel, readable font for body text. Collage of cut-out layers mixing real photography, black and white process photos and local textile line art.

Motion:
- Thread line is an SVG path animated with `stroke-dashoffset`, driven by scroll through CSS `animation-timeline`.
- Parallax with two to three layers uses the same mechanism.
- Text fades in block by block. No animation blocks content for more than one second.
- No animation library. Browsers without scroll-driven animation get a static page that still reads correctly.
- `prefers-reduced-motion` disables motion.

Hero video rules:
- Muted, autoplay, loop, `playsinline`. 10 to 15 seconds, at most 3 MB, WebM with MP4 fallback.
- Poster image shown first and kept when the video cannot play (reduced motion, data saver, slow connection).
- Dark gradient overlay so title text keeps at least 4.5:1 contrast.
- Hero only. Files live at `public/hero.mp4` and `public/hero.webm`, so replacing the placeholder is a single file swap.

Mobile: collage is re-arranged vertically for 375px, not scaled down. Text never sits on a busy image without sufficient contrast.

## 8. Contact, analytics, compliance

- Sticky contact button opens `https://line.me/R/oaMessage/@<VITE_LINE_OA_ID>/?text=<product name>`. Facebook Messenger and phone buttons sit beside it.
- GA4 events: LINE click, Facebook click, phone click, map open, product view.
- PDPA cookie banner blocks GA until the visitor accepts.
- Images are WebP with lazy loading. Target: home page loads within 3 seconds on 4G.
- All personal photos need community permission. Real community images are used at launch. Stitch images are AI-generated and are placeholders only.

## 9. Build order and checkpoints

Each step ends with one commit and push.
1. Scaffold the Vite + React + TS app and connect to Supabase.
2. Migration: new columns and tables, plus RLS read policies.
3. Layout, theme tokens, `StickyContact`, routing.
4. Products list and detail from live data.
5. Home story scroll: hero video, `ThreadLine`, collage layers.
6. Our Story, Visit, Contact.
7. GA4 events and PDPA cookie banner.
8. Admin login, product list, edit form, photo upload.
9. Vercel deploy, then performance and 375px checks.

## 10. Testing

- Vitest for logic that can break: LINE link builder, availability labels, price formatting.
- Manual: 375px layout, contrast, Lighthouse performance and SEO, reduced-motion pass.
- RLS: an anonymous write request must fail.

## 11. Open items to confirm with the community

- Real product list and prices.
- Brand name (mockups use "Sanctuary Craft").
- Local patterns and symbols allowed for use.
- Activities offered to visitors, and opening times.
- Domain and hosting budget.
- Permission for every portrait or historical photo.
