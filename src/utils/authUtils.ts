
import { supabase } from '@/lib/supabase';

export type OAuthProvider = 'facebook';

export const signInWithOAuth = async (provider: OAuthProvider) => {
  return await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth-callback`,
      skipBrowserRedirect: false, // Ensure the browser redirects properly
    },
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
};

export const updatePassword = async (newPassword: string) => {
  return await supabase.auth.updateUser({ password: newPassword });
};

export const updateUserData = async (userData: { [key: string]: any }) => {
  return await supabase.auth.updateUser({
    data: userData
  });
};

export const isEmailVerified = async (userId: string) => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) return false;
  
  // Email is verified if email_confirmed_at is not null
  // or if the user signed in with an OAuth provider which verifies emails
  return (
    data.user.email_confirmed_at !== null || 
    data.user.app_metadata?.provider !== 'email'
  );
};

export const resendVerificationEmail = async (email: string) => {
  return await supabase.auth.resend({
    type: 'signup',
    email,
  });
};
