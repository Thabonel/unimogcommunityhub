// Shared rate limiting middleware for Edge Functions

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix?: string;
}

interface RequestInfo {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (consider Redis for production)
const requestStore = new Map<string, RequestInfo>();

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      maxRequests: config.maxRequests || 10,
      windowMs: config.windowMs || 60000, // 1 minute default
      keyPrefix: config.keyPrefix || 'rate_limit'
    };
  }

  async isAllowed(identifier: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    const now = Date.now();
    const key = `${this.config.keyPrefix}:${identifier}`;
    const requestInfo = requestStore.get(key);

    // Clean up old entries periodically
    if (requestStore.size > 10000) {
      this.cleanup(now);
    }

    if (!requestInfo) {
      // First request
      requestStore.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return { allowed: true };
    }

    if (now >= requestInfo.resetTime) {
      // Window has expired, reset
      requestStore.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return { allowed: true };
    }

    if (requestInfo.count >= this.config.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        retryAfter: Math.ceil((requestInfo.resetTime - now) / 1000)
      };
    }

    // Increment count
    requestInfo.count++;
    requestStore.set(key, requestInfo);
    return { allowed: true };
  }

  private cleanup(now: number) {
    for (const [key, info] of requestStore.entries()) {
      if (now >= info.resetTime) {
        requestStore.delete(key);
      }
    }
  }

  getRemainingRequests(identifier: string): number {
    const key = `${this.config.keyPrefix}:${identifier}`;
    const requestInfo = requestStore.get(key);
    
    if (!requestInfo) {
      return this.config.maxRequests;
    }

    const now = Date.now();
    if (now >= requestInfo.resetTime) {
      return this.config.maxRequests;
    }

    return Math.max(0, this.config.maxRequests - requestInfo.count);
  }
}

// Pre-configured rate limiters for different endpoints
export const rateLimiters = {
  // Strict rate limit for AI chat
  chat: new RateLimiter({
    maxRequests: 10,
    windowMs: 60000, // 10 requests per minute
    keyPrefix: 'chat'
  }),
  
  // Medium rate limit for manual processing
  manualProcessing: new RateLimiter({
    maxRequests: 20,
    windowMs: 60000, // 20 requests per minute
    keyPrefix: 'manual'
  }),
  
  // Lenient rate limit for general API calls
  general: new RateLimiter({
    maxRequests: 100,
    windowMs: 60000, // 100 requests per minute
    keyPrefix: 'api'
  }),
  
  // Strict rate limit for email sending
  email: new RateLimiter({
    maxRequests: 5,
    windowMs: 300000, // 5 emails per 5 minutes
    keyPrefix: 'email'
  }),
  
  // Rate limit for file uploads
  upload: new RateLimiter({
    maxRequests: 10,
    windowMs: 300000, // 10 uploads per 5 minutes
    keyPrefix: 'upload'
  })
};

// Helper function to apply rate limiting in Edge Functions
export async function applyRateLimit(
  userId: string,
  limiter: RateLimiter
): Promise<Response | null> {
  const { allowed, retryAfter } = await limiter.isAllowed(userId);
  
  if (!allowed) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests. Please try again later.',
        retryAfter
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limiter.config.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Date.now() + (retryAfter || 0) * 1000)
        }
      }
    );
  }
  
  return null; // Request is allowed
}