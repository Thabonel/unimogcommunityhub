import { createClient, SupabaseClient } from '@supabase/supabase-js';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// Supabase client for read-only operations
export const supabaseClient: SupabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    global: {
      headers: {
        'X-Client-Info': 'barry-mcp/1.0'
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

// Service role client for signing URLs (if enabled)
export const serviceClient: SupabaseClient | null = process.env.OPTIONAL_SERVICE_ROLE 
  ? createClient(
      process.env.SUPABASE_URL!,
      process.env.OPTIONAL_SERVICE_ROLE!,
      {
        global: {
          headers: {
            'X-Client-Info': 'barry-mcp-service/1.0'
          }
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    )
  : null;

// Helper function to execute queries with timeout
export async function executeQuery<T = any>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  timeoutMs: number = parseInt(process.env.QUERY_TIMEOUT_MS || '15000')
): Promise<{ data: T | null; error: any }> {
  return Promise.race([
    queryFn(),
    new Promise<{ data: null; error: any }>((_, reject) => 
      setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
    )
  ]).catch(error => ({
    data: null,
    error: error.message === 'Query timeout' ? { message: 'Query timeout', code: '504' } : error
  }));
}

// Helper function to sign storage URLs
export function signStorageUrl(bucket: string, path: string, expiresIn: number = 300): Promise<{ data: { signedUrl: string } | null; error: any }> {
  if (!serviceClient) {
    return Promise.resolve({
      data: null,
      error: { message: 'Service role not configured for URL signing', code: '501' }
    });
  }

  try {
    return serviceClient.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
  } catch (error) {
    logger.error({ error, bucket, path }, 'Error signing storage URL');
    return Promise.resolve({
      data: null,
      error: { message: 'Failed to sign URL', code: '500' }
    });
  }
}

// Validate that we have required environment variables
export function validateEnvironment(): void {
  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  logger.info('Supabase client initialized successfully');
}