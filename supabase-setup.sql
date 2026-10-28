-- =========================================================
-- Blushing Beauty — Supabase setup
-- Supabase dashboard > SQL Editor > New query > paste all > Run
-- Safe to run more than once.
-- =========================================================

-- 1) Table that holds the product list and shop settings
create table if not exists public.site_content (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Anyone can read site content" on public.site_content;
create policy "Anyone can read site content"
  on public.site_content for select
  using (true);

drop policy if exists "Admin can insert site content" on public.site_content;
create policy "Admin can insert site content"
  on public.site_content for insert to authenticated
  with check (true);

drop policy if exists "Admin can update site content" on public.site_content;
create policy "Admin can update site content"
  on public.site_content for update to authenticated
  using (true) with check (true);

-- 2) Public storage bucket for product photos
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can view product images" on storage.objects;
create policy "Anyone can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Admin can upload product images" on storage.objects;
create policy "Admin can upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Admin can update product images" on storage.objects;
create policy "Admin can update product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Admin can delete product images" on storage.objects;
create policy "Admin can delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images');

-- 3) IMPORTANT, do this in the dashboard (not SQL):
--    Authentication > Users > Add user  -> create the admin email + password
--    Authentication > Sign In / Providers > Email
--       -> turn OFF "Allow new users to sign up"
--    (so nobody else can create an account and edit the shop)
