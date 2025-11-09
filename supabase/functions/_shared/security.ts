// Security utilities for Edge Functions

// Service Role Key Validation
export function validateServiceRoleKey(): void {
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured');
  }

  // Verify key is not a placeholder or development key
  if (serviceKey.includes('placeholder') ||
      serviceKey.includes('test') ||
      serviceKey.includes('example') ||
      serviceKey.length < 100) {
    throw new Error('Invalid service role key detected');
  }

  // Never log the actual key - only metadata
  console.log(`[Security] Service role key validated (length: ${serviceKey.length})`);
}

// Extract user ID from Authorization header
export async function getUserIdFromAuth(
  request: Request,
  supabaseClient: any
): Promise<{ userId: string | null; error: string | null }> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return { userId: null, error: 'Missing authorization header' };
  }

  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (error || !user) {
      return { userId: null, error: error?.message || 'Invalid token' };
    }

    return { userId: user.id, error: null };
  } catch (error) {
    return { userId: null, error: 'Authentication failed' };
  }
}

// Get client IP address for rate limiting and logging
export function getClientIP(request: Request): string {
  // Try various headers in order of preference
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip', // Cloudflare
    'x-client-ip'
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can be a comma-separated list, take first IP
      return value.split(',')[0].trim();
    }
  }

  return 'unknown';
}

// Input sanitization for SQL-like queries
export function sanitizeInput(input: string, maxLength: number = 500): string {
  if (!input) return '';

  // Truncate to max length
  let sanitized = input.slice(0, maxLength);

  // Remove null bytes and control characters
  sanitized = sanitized.replace(/\x00/g, '');
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Security event logging
interface SecurityEvent {
  type: 'auth_success' | 'auth_failure' | 'rate_limit' | 'invalid_input' | 'access_denied';
  userId?: string;
  ip: string;
  userAgent: string;
  details?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export async function logSecurityEvent(
  event: SecurityEvent,
  supabaseAdmin: any
): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('security_logs')
      .insert({
        event_type: event.type,
        user_id: event.userId,
        ip_address: event.ip,
        user_agent: event.userAgent,
        details: event.details || {},
        severity: event.severity,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('[Security Log] Failed to log event:', error);
    }

    // For critical events, also log to console
    if (event.severity === 'critical') {
      console.error('[CRITICAL SECURITY EVENT]', {
        type: event.type,
        userId: event.userId,
        ip: event.ip,
        details: event.details
      });
    }
  } catch (error) {
    // Don't let logging errors break the function
    console.error('[Security Log] Exception:', error);
  }
}

// Validate request origin for CORS
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;

  const allowedOrigins = [
    'https://unimogcommunityhub.com',
    'https://unimogcommunity-staging.netlify.app',
    'http://localhost:5173', // Local development
    'http://localhost:3000'
  ];

  return allowedOrigins.includes(origin);
}

// Check if user has admin role
export async function isAdmin(
  userId: string,
  supabaseAdmin: any
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      console.error('[Security] Admin check failed:', error);
      return false;
    }

    return data !== null;
  } catch (error) {
    console.error('[Security] Admin check exception:', error);
    return false;
  }
}

// Verify file upload is safe
export function validateFileUpload(
  filename: string,
  contentType: string,
  maxSizeMB: number = 10
): { valid: boolean; error?: string } {
  // Check file extension
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.gpx', '.xml'];
  const extension = filename.toLowerCase().slice(filename.lastIndexOf('.'));

  if (!allowedExtensions.includes(extension)) {
    return { valid: false, error: `File type ${extension} not allowed` };
  }

  // Check content type matches extension
  const contentTypeMap: Record<string, string[]> = {
    '.pdf': ['application/pdf'],
    '.png': ['image/png'],
    '.jpg': ['image/jpeg'],
    '.jpeg': ['image/jpeg'],
    '.gpx': ['application/gpx+xml', 'text/xml', 'application/xml'],
    '.xml': ['text/xml', 'application/xml']
  };

  const allowedContentTypes = contentTypeMap[extension];
  if (!allowedContentTypes?.includes(contentType)) {
    return { valid: false, error: `Content type ${contentType} doesn't match extension ${extension}` };
  }

  // Check filename for path traversal attempts
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return { valid: false, error: 'Invalid filename - path traversal detected' };
  }

  return { valid: true };
}
