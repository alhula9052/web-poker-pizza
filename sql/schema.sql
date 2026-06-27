-- Póker Pizza · Supabase MVP
-- Ejecutar en Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price integer not null check (price >= 0),
  category text,
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price integer check (price >= 0),
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  delivery_type text not null check (delivery_type in ('Retiro en local', 'Delivery')),
  address text,
  comments text,
  subtotal integer not null check (subtotal >= 0),
  whatsapp_message text,
  status text default 'pendiente',
  created_at timestamp with time zone default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  total_price integer not null check (total_price >= 0)
);

alter table products enable row level security;
alter table promotions enable row level security;
alter table gallery_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Lectura pública de productos y promociones activos.
drop policy if exists "Public read active products" on products;
create policy "Public read active products"
on products for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public read active promotions" on promotions;
create policy "Public read active promotions"
on promotions for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public read active gallery items" on gallery_items;
create policy "Public read active gallery items"
on gallery_items for select
to anon, authenticated
using (is_active = true);

-- Permite crear pedidos desde la landing pública.
drop policy if exists "Public insert orders" on orders;
create policy "Public insert orders"
on orders for insert
to anon, authenticated
with check (true);

drop policy if exists "Public insert order items" on order_items;
create policy "Public insert order items"
on order_items for insert
to anon, authenticated
with check (true);

-- Datos iniciales de ejemplo.
insert into products (name, description, price, category, image_url, is_active, sort_order)
values
('Royal Pepperoni', 'Salsa de tomate artesanal, mozzarella fundida y abundante pepperoni.', 10990, 'Clásicas', '/gallery/royal-pepperoni.svg', true, 1),
('Full House Napolitana', 'Tomate, mozzarella, albahaca fresca y aceite de oliva.', 9990, 'Napolitanas', '/gallery/full-house-napolitana.svg', true, 2),
('Carta Maestra', 'Jamón, champiñones, aceitunas, mozzarella y toque especial de la casa.', 11990, 'Especiales', '/gallery/carta-maestra.svg', true, 3),
('Reina de Quesos', 'Mezcla de quesos seleccionados sobre masa artesanal dorada.', 11990, 'Especiales', '/gallery/reina-quesos.svg', true, 4),
('All In Vegetariana', 'Verduras frescas, champiñones, aceitunas, tomate y albahaca.', 10990, 'Vegetarianas', '/gallery/all-in-vegetariana.svg', true, 5),
('Póker Especial', 'La combinación estrella de la casa: intensa, sabrosa y ganadora.', 12990, 'Especiales', '/gallery/poker-especial.svg', true, 6)
on conflict do nothing;

insert into promotions (title, description, price, image_url, is_active, sort_order)
values
('Combo Escalera Real', 'Pizza especial + bebida + salsa de la casa.', 14990, '/gallery/promo.svg', true, 1),
('2 pizzas + bebida', 'El clásico ganador para compartir.', 21990, '/gallery/mesa.svg', true, 2),
('Promo retiro en local', 'Precio especial para pedidos retirados en tienda.', 9990, '/gallery/packaging.svg', true, 3),
('Pizza del día', 'Una combinación distinta cada jornada.', 8990, '/gallery/pizza-day.svg', true, 4)
on conflict do nothing;

insert into gallery_items (title, image_url, is_active, sort_order)
values
('Pizza artesanal', '/gallery/royal-pepperoni.svg', true, 1),
('Horno y fuego', '/gallery/horno.svg', true, 2),
('Cajas premium', '/gallery/packaging.svg', true, 3),
('Ambiente cálido', '/gallery/ambiente.svg', true, 4),
('Mesa rústica', '/gallery/mesa.svg', true, 5),
('Especial de la casa', '/gallery/poker-especial.svg', true, 6)
on conflict do nothing;

-- ------------------------------------------------------------
-- Panel administrador, imágenes y autorización de usuarios.
-- ------------------------------------------------------------

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

drop policy if exists "Admin manage products" on products;
create policy "Admin manage products"
on products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admin manage promotions" on promotions;
create policy "Admin manage promotions"
on promotions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admin manage gallery items" on gallery_items;
create policy "Admin manage gallery items"
on gallery_items for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admin read orders" on orders;
create policy "Admin read orders"
on orders for select
to authenticated
using (public.is_admin());

drop policy if exists "Admin update orders" on orders;
create policy "Admin update orders"
on orders for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admin read order items" on order_items;
create policy "Admin read order items"
on order_items for select
to authenticated
using (public.is_admin());

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
