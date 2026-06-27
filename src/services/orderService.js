import { supabase } from "../lib/supabaseClient";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function saveOrder(orderPayload) {
  if (!supabase) {
    return { saved: false, orderId: null, reason: "Supabase no configurado" };
  }

  const { items, ...orderData } = orderPayload;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderData)
    .select("id")
    .single();

  if (orderError) throw orderError;

  const rows = items.map((item) => ({
    order_id: order.id,
    product_id: UUID_REGEX.test(String(item.id)) ? item.id : null,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(rows);

  if (itemsError) throw itemsError;

  return { saved: true, orderId: order.id };
}
