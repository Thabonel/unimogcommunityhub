import { useEffect } from 'react';

/**
 * Environment Variable Diagnostic Component
 * This component logs the current environment variables (masked) to help debug configuration issues
 * Only runs in development mode or when explicitly enabled
 */
export const EnvDiagnostic = () => {
  useEffect(() => {
    // Only run diagnostics if explicitly enabled or in development
    const shouldRunDiagnostics = 
      import.meta.env.MODE === 'development' || 
      localStorage.getItem('debug_env') === 'true';
    
    if (!shouldRunDiagnostics) return;

    console.group('🔍 Environment Variable Diagnostic');
    
    // Helper to mask sensitive strings
    const maskString = (str: string | undefined): string => {
      if (!str) return '❌ NOT SET';
      if (str.length < 10) return '⚠️ TOO SHORT';
      return `✅ ${str.substring(0, 8)}...${str.substring(str.length - 4)}`;
    };

    // Check Supabase configuration
    console.log('Supabase Configuration:');
    console.log('  URL:', maskString(import.meta.env.VITE_SUPABASE_URL));
    console.log('  Anon Key:', maskString(import.meta.env.VITE_SUPABASE_ANON_KEY));
    console.log('  Project ID:', maskString(import.meta.env.VITE_SUPABASE_PROJECT_ID));
    
    // Check other critical services
    console.log('\nOther Services:');
    console.log('  Mapbox Token:', maskString(import.meta.env.VITE_MAPBOX_ACCESS_TOKEN));
    console.log('  OpenAI Key:', maskString(import.meta.env.VITE_OPENAI_API_KEY));
    
    // Check optional services
    console.log('\nOptional Services:');
    console.log('  Stripe Monthly:', maskString(import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID));
    console.log('  Stripe Lifetime:', maskString(import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID));
    
    // Environment info
    console.log('\nEnvironment Info:');
    console.log('  Mode:', import.meta.env.MODE);
    console.log('  Base URL:', import.meta.env.BASE_URL);
    console.log('  Production:', import.meta.env.PROD);
    console.log('  Development:', import.meta.env.DEV);
    console.log('  SSR:', import.meta.env.SSR);
    
    // Check if running on Netlify
    console.log('\nDeployment Info:');
    console.log('  Netlify:', typeof window !== 'undefined' && window.location.hostname.includes('netlify'));
    console.log('  Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'N/A');
    console.log('  Protocol:', typeof window !== 'undefined' ? window.location.protocol : 'N/A');
    
    // Validation summary
    const criticalMissing = [];
    if (!import.meta.env.VITE_SUPABASE_URL) criticalMissing.push('VITE_SUPABASE_URL');
    if (!import.meta.env.VITE_SUPABASE_ANON_KEY) criticalMissing.push('VITE_SUPABASE_ANON_KEY');
    if (!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN) criticalMissing.push('VITE_MAPBOX_ACCESS_TOKEN');
    if (!import.meta.env.VITE_OPENAI_API_KEY) criticalMissing.push('VITE_OPENAI_API_KEY');
    
    if (criticalMissing.length > 0) {
      console.error('❌ CRITICAL: Missing environment variables:', criticalMissing);
      console.error('These must be set in Netlify Dashboard > Site Settings > Environment Variables');
    } else {
      console.log('✅ All critical environment variables are set');
    }
    
    console.groupEnd();
    
    // Show a warning banner if critical variables are missing in production
    if (import.meta.env.PROD && criticalMissing.length > 0) {
      console.error(
        '%c⚠️ PRODUCTION CONFIGURATION ERROR ⚠️',
        'background: red; color: white; font-size: 16px; padding: 10px;'
      );
      console.error(
        '%cMissing environment variables will cause authentication failures!',
        'color: red; font-size: 14px;'
      );
      console.error('Missing:', criticalMissing.join(', '));
      console.error('Fix: Add these variables in Netlify Dashboard > Site Settings > Environment Variables');
    }
  }, []);

  return null;
};

export default EnvDiagnostic;