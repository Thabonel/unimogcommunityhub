
import { createClient } from '@supabase/supabase-js';

// Default to demo/test values if environment variables are not set
// For production, these should be set in your environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '<JWT_TOKEN>';

// Warn if using placeholder values
if (supabaseUrl === 'https://xyzcompany.supabase.co' || supabaseAnonKey.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')) {
  console.warn('Using placeholder Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for a real Supabase project.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
