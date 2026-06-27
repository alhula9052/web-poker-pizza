-- Póker Pizza · Panel administrador
-- Ejecutar en Supabase SQL Editor después de crear las tablas base.

create extension if not exists pgcrypto;

-- 1) Usuarios administradores autorizados.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamp with time zone default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins read own profile" on public.admin_users;
create policy "Admins read own profile"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

-- Función usada por las políticas RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;


-- Asegura columna de orden para promociones editables en el panel.
alter table public.promotions
add column if not exists sort_order integer default 0;

-- 2) Políticas para administrar productos y promociones.
drop policy if exists "Admin manage products" on public.products;
create policy "Admin manage products"
on public.products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admin manage promotions" on public.promotions;
create policy "Admin manage promotions"
on public.promotions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- 3) Lectura y actualización de pedidos para un futuro panel de cocina/operaciones.
drop policy if exists "Admin read orders" on public.orders;
create policy "Admin read orders"
on public.orders for select
to authenticated
using (public.is_admin());

drop policy if exists "Admin update orders" on public.orders;
create policy "Admin update orders"
on public.orders for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admin read order items" on public.order_items;
create policy "Admin read order items"
on public.order_items for select
to authenticated
using (public.is_admin());

-- 4) Bucket público para imágenes de productos.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Admin upload product images" on storage.objects;
create policy "Admin upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admin update product images" on storage.objects;
create policy "Admin update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admin delete product images" on storage.objects;
create policy "Admin delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());

-- 5) Autorizar tu usuario administrador.
-- Primero crea un usuario en Supabase: Authentication > Users > Add user.
-- Luego reemplaza el correo y ejecuta este bloque:
--
-- insert into public.admin_users (user_id, email)
-- select id, email
-- from auth.users
-- where email = 'TU_CORREO_ADMIN@DOMINIO.CL'
-- on conflict (user_id) do update set email = excluded.email;

-- 6) Galería editable del sitio.
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.gallery_items enable row level security;

drop policy if exists "Public read active gallery items" on public.gallery_items;
create policy "Public read active gallery items"
on public.gallery_items for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admin manage gallery items" on public.gallery_items;
create policy "Admin manage gallery items"
on public.gallery_items for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

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
