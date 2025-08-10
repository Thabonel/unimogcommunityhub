/**
 * Environment Validation
 * Validates all required environment variables on startup
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check Supabase configuration
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Required: Supabase URL
  if (!supabaseUrl) {
    errors.push('VITE_SUPABASE_URL is not configured');
  } else if (!supabaseUrl.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must start with https://');
  } else if (!supabaseUrl.includes('supabase.co')) {
    errors.push('VITE_SUPABASE_URL must be a valid Supabase URL');
  }

  // Required: Supabase Anon Key
  if (!supabaseAnonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is not configured');
  } else if (!supabaseAnonKey.startsWith('eyJ')) {
    errors.push('VITE_SUPABASE_ANON_KEY must be a valid JWT token');
  } else if (supabaseAnonKey.length < 100) {
    errors.push('VITE_SUPABASE_ANON_KEY appears to be truncated');
  }

  // Check for hardcoded values (these should NEVER appear)
  if (supabaseUrl?.includes('ydevatqwkoccxhtejdor')) {
    warnings.push('Supabase URL appears to be hardcoded - should use environment variable');
  }

  // Check Mapbox configuration (optional but recommended)
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  if (!mapboxToken) {
    warnings.push('VITE_MAPBOX_ACCESS_TOKEN is not configured - maps will not work');
  } else if (!mapboxToken.startsWith('pk.')) {
    warnings.push('VITE_MAPBOX_ACCESS_TOKEN format appears invalid');
  }

  // Check OpenAI configuration (optional)
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!openaiKey) {
    warnings.push('VITE_OPENAI_API_KEY is not configured - AI features will not work');
  }

  // Log validation results
  if (errors.length > 0) {
    console.error('❌ Environment Validation Failed:', {
      errors,
      warnings,
      timestamp: new Date().toISOString(),
    });
  } else if (warnings.length > 0) {
    console.warn('⚠️ Environment Validation Warnings:', {
      warnings,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.log('✅ Environment Validation Passed', {
      timestamp: new Date().toISOString(),
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Display environment errors to user
 */
export function getEnvironmentErrorMessage(result: ValidationResult): string {
  if (result.isValid) {
    return '';
  }

  let message = '🚨 Configuration Error\n\n';
  
  if (result.errors.length > 0) {
    message += 'The following configuration errors must be fixed:\n\n';
    result.errors.forEach(error => {
      message += `❌ ${error}\n`;
    });
  }

  message += '\n📋 Setup Instructions:\n\n';
  message += 'For Development:\n';
  message += '1. Create a .env file in the project root\n';
  message += '2. Add the required environment variables:\n';
  message += '   VITE_SUPABASE_URL=https://your-project.supabase.co\n';
  message += '   VITE_SUPABASE_ANON_KEY=your-anon-key\n';
  message += '3. Restart the development server\n\n';
  
  message += 'For Production (Netlify):\n';
  message += '1. Go to Site Settings → Environment Variables\n';
  message += '2. Add the same variables\n';
  message += '3. Redeploy the site\n';

  return message;
}

/**
 * Check if we should show the error page
 */
export function shouldBlockStartup(result: ValidationResult): boolean {
  // Block if critical errors exist
  return !result.isValid;
}

// Run validation on module load
if (typeof window !== 'undefined') {
  const result = validateEnvironment();
  
  // Store result for other components to access
  (window as any).__ENV_VALIDATION__ = result;
}