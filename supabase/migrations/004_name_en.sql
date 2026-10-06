-- Romanised names so English visitors can read who made a piece and which elephant it comes from.
alter table public.artisans add column if not exists name_en text;
alter table public.elephants add column if not exists name_en text;
