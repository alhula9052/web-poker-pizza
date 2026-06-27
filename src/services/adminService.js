import { supabase } from "../lib/supabaseClient";

export async function getAdminProducts() {
  ensureSupabase();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function saveAdminProduct(product) {
  ensureSupabase();

  const payload = normalizeProductPayload(product);

  if (product.id) {
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", product.id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deactivateAdminProduct(productId) {
  ensureSupabase();

  const { error } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", productId);

  if (error) throw error;
}

export async function getAdminPromotions() {
  ensureSupabase();

  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function saveAdminPromotion(promotion) {
  ensureSupabase();

  const payload = normalizePromotionPayload(promotion);

  if (promotion.id) {
    const { data, error } = await supabase
      .from("promotions")
      .update(payload)
      .eq("id", promotion.id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("promotions")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deactivateAdminPromotion(promotionId) {
  ensureSupabase();

  const { error } = await supabase
    .from("promotions")
    .update({ is_active: false })
    .eq("id", promotionId);

  if (error) throw error;
}

export async function getAdminGalleryItems() {
  ensureSupabase();

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function saveAdminGalleryItem(item) {
  ensureSupabase();

  const payload = normalizeGalleryPayload(item);

  if (item.id) {
    const { data, error } = await supabase
      .from("gallery_items")
      .update(payload)
      .eq("id", item.id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("gallery_items")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deactivateAdminGalleryItem(itemId) {
  ensureSupabase();

  const { error } = await supabase
    .from("gallery_items")
    .update({ is_active: false })
    .eq("id", itemId);

  if (error) throw error;
}

export async function uploadProductImage(file, productName) {
  return uploadAdminImage(file, productName, "products");
}

export async function uploadPromotionImage(file, promotionTitle) {
  return uploadAdminImage(file, promotionTitle, "promotions");
}

export async function uploadGalleryImage(file, galleryTitle) {
  return uploadAdminImage(file, galleryTitle, "gallery");
}

async function uploadAdminImage(file, name, folder) {
  ensureSupabase();

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = slugify(name || file.name.replace(`.${fileExt}`, ""));
  const filePath = `${folder}/${Date.now()}-${safeName}.${fileExt}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

function normalizeProductPayload(product) {
  return {
    name: product.name.trim(),
    description: product.description?.trim() || "",
    price: Number(product.price || 0),
    category: product.category?.trim() || "Especiales",
    image_url: product.image_url?.trim() || "/gallery/poker-especial.svg",
    is_active: Boolean(product.is_active),
    sort_order: Number(product.sort_order || 0),
  };
}

function normalizePromotionPayload(promotion) {
  return {
    title: promotion.title.trim(),
    description: promotion.description?.trim() || "",
    price: promotion.price === "" || promotion.price === null ? null : Number(promotion.price || 0),
    image_url: promotion.image_url?.trim() || "/gallery/promo.svg",
    is_active: Boolean(promotion.is_active),
    sort_order: Number(promotion.sort_order || 0),
  };
}

function normalizeGalleryPayload(item) {
  return {
    title: item.title.trim(),
    image_url: item.image_url?.trim() || "/gallery/ambiente.svg",
    is_active: Boolean(item.is_active),
    sort_order: Number(item.sort_order || 0),
  };
}

function slugify(value) {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function ensureSupabase() {
  if (!supabase) {
    throw new Error("Supabase no está configurado. Revisa el archivo .env.");
  }
}
