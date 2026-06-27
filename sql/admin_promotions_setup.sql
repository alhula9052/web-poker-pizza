-- Póker Pizza · Promociones en panel administrador
-- Ejecutar una sola vez en Supabase SQL Editor si ya tienes el proyecto creado.

alter table public.promotions
add column if not exists sort_order integer default 0;

-- Completa orden inicial para promociones existentes.
with ordered_promos as (
  select
    id,
    row_number() over (order by created_at asc) as rn
  from public.promotions
)
update public.promotions p
set sort_order = ordered_promos.rn
from ordered_promos
where p.id = ordered_promos.id
  and coalesce(p.sort_order, 0) = 0;

-- Asegura política de administración de promociones.
drop policy if exists "Admin manage promotions" on public.promotions;
create policy "Admin manage promotions"
on public.promotions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Reutilizamos el bucket público product-images para productos y promociones.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;
