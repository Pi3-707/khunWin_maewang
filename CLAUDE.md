# Khunwin Mae Wang storytelling site

Showcase and storytelling site for community craft products. Not e-commerce: contact happens through LINE and Facebook.

Full design: `docs/superpowers/specs/2026-10-05-khunwin-maewang-design.md`. Read it before changing scope.

## Stack
- Vite + React + TypeScript, `react-router`, `@supabase/supabase-js`
- Supabase project `orqkvfyvhuvchbtbclna` (Khunwin Meawang)
- Deploy on Vercel

## Commands
Added at build step 1 (scaffold). Expected: `npm run dev`, `npm run build`, `npm test`.

## Rules
- Thai only for v1. English columns come later.
- No cart, payment, stock counting or customer accounts.
- Product availability is `ready` or `made_to_order`, never a count.
- Commit and push after each build step in the spec.
- Never commit `.env` or any key. The Supabase anon key lives in env vars only.
- Stitch images are AI placeholders. Real community photos replace them before launch.
- Hero video is `public/hero.mp4` and `public/hero.webm`. Keep it at 3 MB or less.
