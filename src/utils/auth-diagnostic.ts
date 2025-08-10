/**
 * Authentication Diagnostic and Recovery Tool
 * Implements permanent fixes for "Invalid API key" errors
 * Based on AUTH_ERROR_PREVENTION.md guidelines
 */

import { supabase } from '@/lib/supabase-client';

export interface DiagnosticResult {
  status: 'healthy' | 'warning' | 'error';
  checks: {
    envVars: boolean;
    apiKeyFormat: boolean;
    networkConnection: boolean;
    sessionValid: boolean;
    localStorage: boolean;
  };
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export class AuthDiagnostic {
  /**
   * Run comprehensive diagnostic checks
   */
  static async runDiagnostics(): Promise<DiagnosticResult> {
    const result: DiagnosticResult = {
      status: 'healthy',
      checks: {
        envVars: false,
        apiKeyFormat: false,
        networkConnection: false,
        sessionValid: false,
        localStorage: false
      },
      errors: [],
      warnings: [],
      recommendations: []
    };

    // 1. Check environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      result.errors.push('VITE_SUPABASE_URL is not configured');
      result.recommendations.push('Check Netlify environment variables');
    } else if (!supabaseUrl.includes('supabase.co')) {
      result.errors.push('Invalid Supabase URL format');
    } else {
      result.checks.envVars = true;
    }

    if (!supabaseKey) {
      result.errors.push('VITE_SUPABASE_ANON_KEY is not configured');
      result.recommendations.push('Check Netlify environment variables');
    } else if (!supabaseKey.startsWith('eyJ')) {
      result.errors.push('Invalid API key format (not a JWT token)');
    } else if (supabaseKey.length < 100) {
      result.warnings.push('API key appears truncated');
    } else {
      result.checks.apiKeyFormat = true;
    }

    // 2. Check localStorage for stale tokens
    if (typeof window !== 'undefined') {
      const staleTokens = this.checkForStaleTokens();
      if (staleTokens.length > 0) {
        result.warnings.push(`Found ${staleTokens.length} potentially stale auth tokens`);
        result.recommendations.push('Consider clearing browser cache');
      } else {
        result.checks.localStorage = true;
      }
    }

    // 3. Test network connection to Supabase
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (error?.message?.includes('Invalid API key')) {
        result.errors.push('API key is invalid or expired');
        result.recommendations.push('Verify API key in Supabase Dashboard');
      } else if (error?.message?.includes('JWT')) {
        result.warnings.push('Session token issue detected');
        result.recommendations.push('Try signing out and back in');
      } else {
        result.checks.networkConnection = true;
      }
    } catch (error: any) {
      result.errors.push(`Network error: ${error.message}`);
    }

    // 4. Check current session
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session && !error) {
        result.checks.sessionValid = true;
      } else if (error?.message?.includes('Invalid API key')) {
        result.errors.push('Session validation failed due to API key');
      }
    } catch (error: any) {
      result.warnings.push('Could not validate session');
    }

    // Determine overall status
    if (result.errors.length > 0) {
      result.status = 'error';
    } else if (result.warnings.length > 0) {
      result.status = 'warning';
    }

    return result;
  }

  /**
   * Check for stale authentication tokens in localStorage
   */
  static checkForStaleTokens(): string[] {
    const staleTokens: string[] = [];
    
    if (typeof window === 'undefined') return staleTokens;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      // Check for Supabase auth tokens
      if (key.includes('supabase.auth.token') || key.startsWith('sb-')) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const data = JSON.parse(value);
            // Check if token is expired
            if (data.expires_at) {
              const expiresAt = new Date(data.expires_at).getTime();
              if (expiresAt < Date.now()) {
                staleTokens.push(key);
              }
            }
          }
        } catch {
          // If can't parse, consider it stale
          staleTokens.push(key);
        }
      }
    }
    
    return staleTokens;
  }

  /**
   * Automatic recovery attempt for common issues
   */
  static async attemptAutoRecovery(): Promise<boolean> {
    console.log('🔧 Attempting automatic recovery...');
    
    try {
      // 1. Clear only expired/invalid tokens
      const staleTokens = this.checkForStaleTokens();
      staleTokens.forEach(key => {
        console.log(`Removing stale token: ${key}`);
        localStorage.removeItem(key);
      });

      // 2. Clear any invalid session without clearing valid ones
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error?.message?.includes('Invalid API key')) {
        console.log('Clearing invalid session due to API key error');
        await supabase.auth.signOut();
        return true;
      }

      // 3. If session exists but is expired, refresh it
      if (session && session.expires_at) {
        const expiresAt = typeof session.expires_at === 'number' 
          ? session.expires_at 
          : new Date(session.expires_at).getTime() / 1000;
        
        if (expiresAt < Date.now() / 1000) {
          console.log('Session expired, attempting refresh...');
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (!refreshError) {
            console.log('✅ Session refreshed successfully');
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Auto-recovery failed:', error);
      return false;
    }
  }

  /**
   * Generate a diagnostic report for debugging
   */
  static async generateReport(): Promise<string> {
    const diagnostic = await this.runDiagnostics();
    const timestamp = new Date().toISOString();
    
    let report = `=== Authentication Diagnostic Report ===\n`;
    report += `Timestamp: ${timestamp}\n`;
    report += `Status: ${diagnostic.status.toUpperCase()}\n\n`;
    
    report += `Checks:\n`;
    Object.entries(diagnostic.checks).forEach(([check, passed]) => {
      report += `  ${passed ? '✅' : '❌'} ${check}\n`;
    });
    
    if (diagnostic.errors.length > 0) {
      report += `\nErrors:\n`;
      diagnostic.errors.forEach(error => {
        report += `  ❌ ${error}\n`;
      });
    }
    
    if (diagnostic.warnings.length > 0) {
      report += `\nWarnings:\n`;
      diagnostic.warnings.forEach(warning => {
        report += `  ⚠️ ${warning}\n`;
      });
    }
    
    if (diagnostic.recommendations.length > 0) {
      report += `\nRecommendations:\n`;
      diagnostic.recommendations.forEach(rec => {
        report += `  → ${rec}\n`;
      });
    }
    
    report += `\nEnvironment:\n`;
    report += `  URL: ${import.meta.env.VITE_SUPABASE_URL || 'NOT SET'}\n`;
    report += `  Key Length: ${import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0}\n`;
    report += `  Mode: ${import.meta.env.MODE}\n`;
    
    return report;
  }

  /**
   * Smart error handler that doesn't aggressively clear sessions
   */
  static handleAuthError(error: any): void {
    console.log('🔍 Auth error handler triggered:', error);
    
    // Only clear session for specific JWT errors
    const shouldClearSession = 
      error?.message?.includes('JWT expired') ||
      error?.message?.includes('Invalid JWT') ||
      error?.message?.includes('JWT malformed');
    
    if (shouldClearSession) {
      console.log('Clearing session due to JWT error');
      supabase.auth.signOut();
    } else if (error?.message?.includes('Invalid API key')) {
      // Don't clear session, this is a configuration issue
      console.error('API key configuration error - NOT clearing session');
      console.error('Check Netlify environment variables');
    }
  }
}

// Export for use in components
export default AuthDiagnostic;