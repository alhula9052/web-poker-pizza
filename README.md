# Póker Pizza · Landing React + Vite + Supabase + Admin

Prototipo comercial responsive para Póker Pizza, con carta digital, carrito local, guardado de pedidos en Supabase, envío por WhatsApp y panel administrador para productos, promociones y galería.

## Ejecutar en VS Code

```bash
cd poker-pizza-página-web
npm install
npm run dev
```

Abrir la URL local que muestra la terminal, normalmente:

```txt
http://localhost:5173
```

## Variables de entorno

El proyecto incluye un archivo `.env` con las credenciales públicas entregadas para Supabase.

Antes de usar en producción, reemplazar el WhatsApp demo:

```env
VITE_WHATSAPP_NUMBER=56900000000
```

por el número real, sin `+`, espacios ni guiones.

## Crear base de datos en Supabase

Si partes desde cero, entra a Supabase > SQL Editor y ejecuta:

```txt
sql/schema.sql
```

Ese script crea las tablas `products`, `promotions`, `gallery_items`, `orders`, `order_items`, políticas RLS, bucket de imágenes y datos iniciales.

Si ya tienes el proyecto funcionando y solo quieres agregar la edición de galería, ejecuta:

```txt
sql/admin_gallery_setup.sql
```

Si aún no has configurado permisos de administrador, ejecuta también:

```txt
sql/admin_setup.sql
```

## Crear acceso administrador

1. En Supabase, ir a **Authentication > Users > Add user**.
2. Crear un usuario con correo y contraseña.
3. En **SQL Editor**, ejecutar este bloque reemplazando el correo:

```sql
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'TU_CORREO_ADMIN@DOMINIO.CL'
on conflict (user_id) do update set email = excluded.email;
```

4. Recomendado: en **Authentication > Providers > Email**, desactivar el registro público si no quieres que terceros creen cuentas.

## Ingresar al panel

En el sitio, bajar al footer y presionar:

```txt
Ingreso administrador
```

También puedes abrir directamente:

```txt
http://localhost:5173/#admin
```

El panel permite:

- Crear productos.
- Editar nombre, descripción, precio, categoría y orden.
- Crear y editar promociones.
- Editar imágenes de la galería pública.
- Subir imágenes al bucket `product-images`.
- Pegar una URL de imagen manualmente.
- Activar u ocultar productos, promociones e imágenes.

## Flujo del pedido

1. Cliente agrega pizzas al carrito.
2. Completa datos de contacto.
3. El pedido se guarda en Supabase.
4. Se abre WhatsApp con el resumen del pedido.

## Próximas mejoras sugeridas

- Panel de pedidos recibidos.
- Cambio de estados: pendiente, confirmado, preparando, listo y entregado.
- Integración con pago online.
- Integración con boleta electrónica.
