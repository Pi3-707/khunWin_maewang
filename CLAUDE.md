# Khunwin Mae Wang storytelling site

Showcase and storytelling site for community craft products. Not e-commerce: contact happens through LINE and Facebook.

Full design: `docs/superpowers/specs/2026-10-05-khunwin-maewang-design.md`. Read it before changing scope.

## Stack
- Vite + React + TypeScript, `react-router`, `@supabase/supabase-js`
- Supabase project `orqkvfyvhuvchbtbclna` (Khunwin Meawang)
- Deploy on Vercel

## Commands
- `npm run dev` start dev server
- `npm run build` typecheck and build
- `npm test` run Vitest once

## Rules
- Bilingual (Thai default for Thai browsers, English otherwise). Interface text lives in `src/i18n/strings.ts`; database text uses `_en` columns that fall back to Thai when empty.
- No cart, payment, stock counting or customer accounts.
- Product availability is `ready` or `made_to_order`, never a count.
- Commit and push after each build step in the spec.
- Never commit `.env` or any key. The Supabase anon key lives in env vars only.
- Stitch images are AI placeholders. Real community photos replace them before launch.
- Hero video is `public/hero.mp4` (owner clip, 37.5 MB, index moved to the front so it streams). The requirement doc target is 3 MB or less: compress it before launch.
