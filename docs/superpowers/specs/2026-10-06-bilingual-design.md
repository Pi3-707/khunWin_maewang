# Bilingual Site (Thai / English): Design

Date: 2026-10-06
Builds on: `docs/superpowers/specs/2026-10-05-khunwin-maewang-design.md` (this replaces its "Thai only for v1" decision).

## 1. Purpose

The site serves two audiences:
- Thai visitors, mostly arriving from Facebook and LINE on phones. Thai stays the default for them.
- Foreign visitors: tourists in Chiang Mai and ethical-craft buyers. They need the full story in English to understand why the products are worth more.

One button switches every piece of text on the public site, including product content from Supabase.

## 2. Decisions

| Topic | Decision |
|---|---|
| Approach | No i18n library. One dictionary file for interface text, `_en` columns for database text. |
| Default language | First visit: Thai if any browser language starts with `th`, otherwise English. Afterwards the visitor's choice is remembered. |
| Override in URL | `?lang=en` or `?lang=th` sets the language, so English links can be shared. |
| Missing English | Any empty `_en` field falls back to the Thai value. Pages never show blanks. |
| Initial English content | Written by Claude for every current row, warm and story-first rather than literal. The community can edit it later in admin. |
| Not translated | The Facebook card (it is the shop's real name), the Drive video, admin interface labels. |

## 3. Language switch

- A TH | EN pill in the header next to the nav: thin rose outline, the active side filled rose `#864d53` with white text, small caps letters. Each side is a real button with `aria-pressed`.
- On phones it sits at the end of the header row and wraps with the nav.
- Switching sets `document.documentElement.lang` to `th` or `en`, updates the page title, and saves the choice in `localStorage` (wrapped in try/catch).

## 4. Interface text

- `src/i18n/strings.ts` holds every interface string as `{ th, en }` pairs, keyed by a short name such as `nav.products` or `cta.inquire`.
- `src/i18n/LangContext.tsx` provides `lang`, `setLang`, `t(key)` and `pick(row, field)`.
- Static copy that is not a short label (Our Story paragraphs, Home story text, footer text, cookie banner) also moves into `strings.ts`.
- Category labels, availability labels and the "ask for price" text come from the same dictionary. `categoryLabel` and `availabilityLabel` take the language as a parameter.
- The LINE message prefix follows the language: "สนใจสินค้า:" or "Interested in:".

## 5. Database text (one migration)

Add nullable English columns:
- `products`: `name_en`, `description_en`, `story_summary_en`
- `stories`: `title_en`, `introduction_en`, `origin_story_en`, `value_story_en`
- `materials`: `name_en`, `origin_en`, `description_en`
- `processes`: `name_en`, `description_en`
- `artisans`: `role_en`, `bio_en` (names stay as written)
- `elephants`: `description_en`
- `purchase_channels`: `name_en`, `description_en`
- `visit_info`: `title_en`, `body_en`

`pick(row, 'name')` returns `row.name_en` when the language is English and the value is non-empty, otherwise `row.name`.

Claude fills the `_en` columns for every existing row in a separate data step and shows the rows before writing.

## 6. Admin

The product form gets an English field under each Thai text field (name, description, short story). Admin labels stay Thai.

## 7. Testing

Vitest, pure functions only:
- `detectLang`: `['th-TH']` gives `th`; `['en-US']`, `['zh-CN']` and `[]` give `en`; a stored choice beats the browser; `?lang=` beats both.
- `pick`: English value used when present; empty string and null fall back to Thai; Thai mode always returns Thai.
- Dictionary completeness: every key has a non-empty `th` and `en`.
- `buildLineLink` with the English prefix.
- Labels: categories and availability in both languages.

Manual: toggle on every public page, check no Thai remains in English mode (except the Facebook card and Thai proper names), reload keeps the choice, `?lang=en` works, 375px header layout.

## 8. Out of scope

- Separate `/en/` URLs and per-language SEO indexing. Google will index the Thai version; the English `?lang=en` link is for sharing.
- More languages. The structure allows a third later.
- Translating admin screens.
