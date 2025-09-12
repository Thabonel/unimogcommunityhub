import { RateLimitBucket } from './types.js';

export class TokenBucketRateLimiter {
  private buckets = new Map<string, RateLimitBucket>();
  private maxTokens: number;
  private refillRate: number; // tokens per second
  private windowMs: number;

  constructor(maxTokens = 100, refillRate = 10, windowMs = 60000) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.windowMs = windowMs;
    
    // Clean up old buckets every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private getBucket(key: string): RateLimitBucket {
    const now = Date.now();
    let bucket = this.buckets.get(key);
    
    if (!bucket) {
      bucket = {
        tokens: this.maxTokens,
        lastRefill: now,
        maxTokens: this.maxTokens,
        refillRate: this.refillRate
      };
      this.buckets.set(key, bucket);
      return bucket;
    }

    // Refill tokens based on time passed
    const timePassed = (now - bucket.lastRefill) / 1000;
    const tokensToAdd = timePassed * this.refillRate;
    bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    return bucket;
  }

  public checkLimit(key: string, cost = 1): { allowed: boolean; retryAfter?: number } {
    const bucket = this.getBucket(key);
    
    if (bucket.tokens >= cost) {
      bucket.tokens -= cost;
      return { allowed: true };
    }

    // Calculate retry after in seconds
    const tokensNeeded = cost - bucket.tokens;
    const retryAfter = Math.ceil(tokensNeeded / this.refillRate);
    
    return { allowed: false, retryAfter };
  }

  private cleanup(): void {
    const now = Date.now();
    const cutoff = now - this.windowMs;
    
    for (const [key, bucket] of this.buckets.entries()) {
      if (bucket.lastRefill < cutoff) {
        this.buckets.delete(key);
      }
    }
  }

  public getStats(): { totalBuckets: number; maxTokens: number; refillRate: number } {
    return {
      totalBuckets: this.buckets.size,
      maxTokens: this.maxTokens,
      refillRate: this.refillRate
    };
  }
}