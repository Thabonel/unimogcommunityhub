
import { createClient } from '@supabase/supabase-js';

import { SUPABASE_CONFIG } from '@/config/env';

// Initialize the Supabase client
const supabaseUrl = SUPABASE_CONFIG.url;
const supabaseAnonKey = SUPABASE_CONFIG.anonKey;

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
