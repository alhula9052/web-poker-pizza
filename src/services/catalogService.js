import { supabase } from "../lib/supabaseClient";
import { galleryMock, productsMock, promotionsMock } from "../data/mockData";

export async function getProducts() {
  if (!supabase) return productsMock;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error cargando productos desde Supabase:", error.message);
    return productsMock;
  }

  return data?.length ? data : productsMock;
}

export async function getPromotions() {
  if (!supabase) return promotionsMock;

  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando promociones desde Supabase:", error.message);
    return promotionsMock;
  }

  return data?.length ? data : promotionsMock;
}

export async function getGalleryItems() {
  if (!supabase) return galleryMock;

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando galería desde Supabase:", error.message);
    return galleryMock;
  }

  return data?.length ? data : galleryMock;
}
