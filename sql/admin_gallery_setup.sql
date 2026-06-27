-- Póker Pizza · Galería editable en panel administrador
-- Ejecutar en Supabase SQL Editor si ya tienes productos/promociones funcionando.

create extension if not exists pgcrypto;

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.gallery_items enable row level security;

-- Lectura pública solo de imágenes activas.
drop policy if exists "Public read active gallery items" on public.gallery_items;
create policy "Public read active gallery items"
on public.gallery_items for select
to anon, authenticated
using (is_active = true);

-- Administración completa solo para usuarios autorizados en public.admin_users.
drop policy if exists "Admin manage gallery items" on public.gallery_items;
create policy "Admin manage gallery items"
on public.gallery_items for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Datos iniciales si la tabla está vacía.
insert into public.gallery_items (title, image_url, is_active, sort_order)
select *
from (
  values
    ('Pizza artesanal', '/gallery/royal-pepperoni.svg', true, 1),
    ('Horno y fuego', '/gallery/horno.svg', true, 2),
    ('Cajas premium', '/gallery/packaging.svg', true, 3),
    ('Ambiente cálido', '/gallery/ambiente.svg', true, 4),
    ('Mesa rústica', '/gallery/mesa.svg', true, 5),
    ('Especial de la casa', '/gallery/poker-especial.svg', true, 6)
) as seed(title, image_url, is_active, sort_order)
where not exists (select 1 from public.gallery_items);

-- Reutilizamos el bucket público product-images para productos, promociones y galería.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;
