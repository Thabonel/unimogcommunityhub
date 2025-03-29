
import { supabase } from '@/lib/supabase';

export type OAuthProvider = 'facebook';

export const signInWithOAuth = async (provider: OAuthProvider) => {
  return await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};
