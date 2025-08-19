/**
 * Auth Reset Utility
 * Clears all authentication tokens and resets the Supabase connection
 */

import { supabase } from '@/lib/supabase-client';

export async function clearAuthTokens() {
  console.log('Clearing all auth tokens...');
  
  // Clear all Supabase-related items from localStorage
  const keysToRemove = [
    'supabase.auth.token',
    'sb-ydevatqwkoccxhtejdor-auth-token',
    'sb-ydevatqwkoccxhtejdor-auth-token-code-verifier',
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`Removed: ${key}`);
  });
  
  // Clear all items that start with 'sb-'
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sb-')) {
      localStorage.removeItem(key);
      console.log(`Removed: ${key}`);
    }
  });
  
  // Clear sessionStorage as well
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('sb-') || key.includes('supabase')) {
      sessionStorage.removeItem(key);
      console.log(`Removed from session: ${key}`);
    }
  });
  
  // Sign out from Supabase
  try {
    await supabase.auth.signOut();
    console.log('Signed out from Supabase');
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

export async function resetSupabaseConnection() {
  // Clear tokens first
  await clearAuthTokens();
  
  // Get current session
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return false;
  }
  
  if (session) {
    console.log('Session still active after clearing tokens');
    // Try to refresh the session
    const { data, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      console.error('Error refreshing session:', refreshError);
      return false;
    }
    console.log('Session refreshed successfully');
    return true;
  }
  
  console.log('No active session');
  return false;
}

export function clearAndReload() {
  clearAuthTokens().then(() => {
    console.log('Auth tokens cleared, reloading page...');
    window.location.reload();
  });
}