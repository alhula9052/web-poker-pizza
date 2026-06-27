import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasSupabaseCredentials =
  Boolean(supabaseUrl) &&
  Boolean(supabaseKey) &&
  !supabaseUrl.includes("TU-PROYECTO") &&
  !supabaseKey.includes("TU_ANON_KEY");

export const supabase = hasSupabaseCredentials
  ? createClient(supabaseUrl, supabaseKey)
  : null;
