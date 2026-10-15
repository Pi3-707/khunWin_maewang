-- Only emails listed in public.admins may edit; any other signed-in account is read-only.
create table if not exists public.admins (email text primary key);
alter table public.admins enable row level security;  -- no policies: not readable through the API

insert into public.admins (email) values ('krab2548@gmail.com') on conflict do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where email = lower(auth.jwt() ->> 'email'));
$$;

drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "admin write product_images" on public.product_images;
create policy "admin write product_images" on public.product_images for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "photos admin insert" on storage.objects;
create policy "photos admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-photos' and (select public.is_admin()));

drop policy if exists "photos admin update" on storage.objects;
create policy "photos admin update" on storage.objects for update to authenticated
  using (bucket_id = 'product-photos' and (select public.is_admin()));

drop policy if exists "photos admin delete" on storage.objects;
create policy "photos admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'product-photos' and (select public.is_admin()));
