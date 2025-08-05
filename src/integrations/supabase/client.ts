
import { createClient } from '@supabase/supabase-js';

import { SUPABASE_CONFIG } from '@/config/env';

// Validate environment variables with helpful error messages
const supabaseUrl = SUPABASE_CONFIG.url;
const supabaseAnonKey = SUPABASE_CONFIG.anonKey;

if (!supabaseUrl || supabaseUrl === '') {
  console.error('🚨 SUPABASE CONFIGURATION ERROR');
  console.error('');
  console.error('Environment variable VITE_SUPABASE_URL is not set.');
  console.error('');
  console.error('To fix this in Lovable:');
  console.error('1. Go to Environment Variables settings');
  console.error('2. Add: VITE_SUPABASE_URL = https://ydevatqwkoccxhtejdor.supabase.co');
  console.error('3. Add: VITE_SUPABASE_ANON_KEY = <SUPABASE_ANON_KEY>
  console.error('4. Add: VITE_SUPABASE_PROJECT_ID = ydevatqwkoccxhtejdor');
  console.error('5. Restart the preview');
  console.error('');
  console.error('See LOVABLE_AI_INSTRUCTIONS.md for complete setup guide.');
  
  throw new Error('❌ SUPABASE_URL environment variable is required. Check console for setup instructions.');
}

if (!supabaseAnonKey || supabaseAnonKey === '') {
  console.error('🚨 SUPABASE CONFIGURATION ERROR');
  console.error('Environment variable VITE_SUPABASE_ANON_KEY is not set.');
  console.error('See console above for complete setup instructions.');
  
  throw new Error('❌ SUPABASE_ANON_KEY environment variable is required. Check console for setup instructions.');
}

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
