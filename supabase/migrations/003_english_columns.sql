-- English versions of content shown on the public site. Empty means "show the Thai text".
alter table public.products
  add column if not exists name_en text,
  add column if not exists description_en text,
  add column if not exists story_summary_en text;
alter table public.stories
  add column if not exists title_en text,
  add column if not exists introduction_en text,
  add column if not exists origin_story_en text,
  add column if not exists value_story_en text;
alter table public.materials
  add column if not exists name_en text,
  add column if not exists origin_en text,
  add column if not exists description_en text;
alter table public.processes
  add column if not exists name_en text,
  add column if not exists description_en text;
alter table public.artisans
  add column if not exists role_en text,
  add column if not exists bio_en text;
alter table public.elephants
  add column if not exists description_en text;
alter table public.purchase_channels
  add column if not exists name_en text,
  add column if not exists description_en text;
alter table public.visit_info
  add column if not exists title_en text,
  add column if not exists body_en text;
