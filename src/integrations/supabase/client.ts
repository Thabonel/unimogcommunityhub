
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseAnonKey = '<JWT_TOKEN>';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (url, init) => fetch(url, init)
  },
});

// Convenience export as default
export default supabase;
