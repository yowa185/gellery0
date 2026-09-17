import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const ARTWORK_IMAGE_BUCKET = 'artwork-images';

// null when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY aren't set yet, so the rest
// of the app (header, cart, profile) still works before Supabase is configured.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
