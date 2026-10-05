alter table public.products
  add column if not exists reference_price numeric(10,2),
  add column if not exists availability text not null default 'made_to_order'
    check (availability in ('ready', 'made_to_order'));

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  display_order int not null default 1
);

create table if not exists public.visit_info (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('activity', 'hours', 'direction', 'map')),
  title text,
  body text not null,
  display_order int not null default 1
);

alter table public.product_images enable row level security;
alter table public.visit_info enable row level security;

drop policy if exists "Public can read product images" on public.product_images;
create policy "Public can read product images" on public.product_images
  for select to anon, authenticated using (true);

drop policy if exists "Public can read visit info" on public.visit_info;
create policy "Public can read visit info" on public.visit_info
  for select to anon, authenticated using (true);

drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products
  for all to authenticated using (true) with check (true);

drop policy if exists "admin write product_images" on public.product_images;
create policy "admin write product_images" on public.product_images
  for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

drop policy if exists "photos admin insert" on storage.objects;
create policy "photos admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-photos');

drop policy if exists "photos admin update" on storage.objects;
create policy "photos admin update" on storage.objects
  for update to authenticated using (bucket_id = 'product-photos');

drop policy if exists "photos admin delete" on storage.objects;
create policy "photos admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'product-photos');
