
import { supabase } from '@/lib/supabase';

export type OAuthProvider = 'facebook' | 'google';

export const signInWithOAuth = async (provider: OAuthProvider) => {
  return await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};
