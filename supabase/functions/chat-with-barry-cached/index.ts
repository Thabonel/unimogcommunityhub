// supabase/functions/chat-with-barry-cached/index.ts
// Safe Response Caching Wrapper for Barry AI
// Zero-risk implementation that wraps existing functionality

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

// Types
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

interface VehicleProfile {
  id: string;
  year?: number;
  make?: string;
  model?: string;
  series_number?: string;
  engine_type?: string;
  transmission_type?: string;
  userModel?: string;
}

interface CachedResponse {
  content: string;
  manualReferences?: any[];
  metadata: {
    cached: boolean;
    cacheHit: boolean;
    originalResponseTime?: number;
    cacheTimestamp?: number;
    vehicleProfile?: VehicleProfile;
  };
}

interface CacheStats {
  hits: number;
  misses: number;
  errors: number;
  bypassed: number;
}

// In-memory cache (fallback if Redis unavailable)
class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private stats: CacheStats = { hits: 0, misses: 0, errors: 0, bypassed: 0 };
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        this.stats.misses++;
        return null;
      }
      
      // Check if expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        this.stats.misses++;
        return null;
      }
      
      this.stats.hits++;
      return entry.data as T;
    } catch (error) {
      this.stats.errors++;
      console.error('Cache get error:', error);
      return null;
    }
  }
  
  async set<T>(key: string, data: T, ttlMs: number): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttlMs,
        key
      };
      
      this.cache.set(key, entry);
      
      // Cleanup old entries periodically
      if (Math.random() < 0.01) { // 1% chance
        this.cleanup();
      }
    } catch (error) {
      this.stats.errors++;
      console.error('Cache set error:', error);
    }
  }
  
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
  
  getStats(): CacheStats {
    return { ...this.stats };
  }
  
  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, errors: 0, bypassed: 0 };
  }
}

// Global cache instance
const cache = new MemoryCache();

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  VEHICLE_PROFILE: 5 * 60 * 1000,  // 5 minutes
  QUERY_RESPONSE: 30 * 60 * 1000,  // 30 minutes
  MANUAL_SEARCH: 60 * 60 * 1000,   // 1 hour
} as const;

// Utility functions
async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

function generateCacheKeys(userId: string, query: string) {
  return {
    vehicleProfile: `vehicle_${userId}_profile`,
    queryResponse: async () => {
      const queryHash = await hashString(query.toLowerCase().trim());
      return `response_${userId}_${queryHash}`;
    },
    manualSearch: async (searchTerms: string) => {
      const searchHash = await hashString(searchTerms.toLowerCase().trim());
      return `manual_${searchHash}`;
    }
  };
}

// Original function caller
async function callOriginalBarryFunction(
  request: Request,
  supabaseClient: any
): Promise<Response> {
  try {
    // Call the original chat-with-barry-claude function
    const { data, error } = await supabaseClient.functions.invoke('chat-with-barry-claude', {
      body: await request.json(),
      headers: Object.fromEntries(request.headers.entries())
    });
    
    if (error) {
      throw error;
    }
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-skip-cache',
      },
    });
  } catch (error) {
    console.error('Error calling original Barry function:', error);
    throw error;
  }
}

// Cache user vehicle profile
async function cacheVehicleProfile(
  userId: string,
  supabaseClient: any
): Promise<VehicleProfile | null> {
  const cacheKeys = generateCacheKeys(userId, '');
  const vehicleCacheKey = cacheKeys.vehicleProfile;
  
  // Try to get from cache first
  const cachedProfile = await cache.get<VehicleProfile>(vehicleCacheKey);
  if (cachedProfile) {
    console.log(`Cache hit: vehicle profile for user ${userId}`);
    return cachedProfile;
  }
  
  try {
    // Fetch from database
    const { data: vehicleData, error } = await supabaseClient
      .from('vehicles')
      .select('id, year, make, model, series_number, engine_type, transmission_type')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Error fetching vehicle profile:', error);
      return null;
    }
    
    const profile: VehicleProfile | null = vehicleData?.[0] || null;
    
    if (profile) {
      // Add computed userModel field
      const userModel = `${profile.year || ''} ${profile.make || ''} ${profile.model || ''}`.trim();
      profile.userModel = userModel;
      
      // Cache the result
      await cache.set(vehicleCacheKey, profile, CACHE_TTL.VEHICLE_PROFILE);
      console.log(`Cached vehicle profile for user ${userId}`);
    }
    
    return profile;
  } catch (error) {
    console.error('Error in cacheVehicleProfile:', error);
    return null;
  }
}

// Process and potentially cache the response
async function processResponse(
  originalResponse: any,
  userId: string,
  query: string,
  vehicleProfile: VehicleProfile | null,
  startTime: number
): Promise<CachedResponse> {
  const endTime = Date.now();
  const responseTime = endTime - startTime;
  
  // Generate cache key for this query
  const cacheKeys = generateCacheKeys(userId, query);
  const queryCacheKey = await cacheKeys.queryResponse();
  
  // Create enhanced response with metadata
  const cachedResponse: CachedResponse = {
    content: originalResponse.content || originalResponse.message || 'No response available',
    manualReferences: originalResponse.manualReferences || [],
    metadata: {
      cached: true,
      cacheHit: false,
      originalResponseTime: responseTime,
      cacheTimestamp: Date.now(),
      vehicleProfile: vehicleProfile || undefined
    }
  };
  
  // Cache the response for future use
  try {
    await cache.set(queryCacheKey, cachedResponse, CACHE_TTL.QUERY_RESPONSE);
    console.log(`Cached response for query hash: ${queryCacheKey.split('_').pop()}`);
  } catch (error) {
    console.error('Error caching response:', error);
  }
  
  return cachedResponse;
}

// Main cached function handler
async function handleCachedRequest(request: Request): Promise<Response> {
  const startTime = Date.now();
  
  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-skip-cache',
      }
    });
  }
  
  try {
    // Parse request
    const requestBody = await request.json();
    const { messages } = requestBody;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid request: messages array required');
    }
    
    // Extract user query
    const userMessage = messages[messages.length - 1];
    const query = userMessage.content || '';
    
    // Check for cache bypass header
    const skipCache = request.headers.get('X-Skip-Cache') === 'true';
    if (skipCache) {
      console.log('Cache bypassed via header');
      const bypassed = cache.getStats();
      bypassed.bypassed++;
    }
    
    // Get user from JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    
    // Extract user ID from JWT (simplified - in production, properly decode JWT)
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid or expired token');
    }
    
    const userId = user.id;
    
    // Generate cache keys
    const cacheKeys = generateCacheKeys(userId, query);
    const queryCacheKey = await cacheKeys.queryResponse();
    
    // Try to get cached response first (unless bypassed)
    if (!skipCache) {
      const cachedResponse = await cache.get<CachedResponse>(queryCacheKey);
      if (cachedResponse) {
        console.log(`Cache hit: query response for user ${userId}`);
        
        // Update metadata
        cachedResponse.metadata.cacheHit = true;
        cachedResponse.metadata.cacheTimestamp = Date.now();
        
        const endTime = Date.now();
        console.log(`Cached response served in ${endTime - startTime}ms`);
        
        return new Response(JSON.stringify(cachedResponse), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-skip-cache',
            'X-Cache-Status': 'HIT',
            'X-Response-Time': `${endTime - startTime}ms`,
          },
        });
      }
    }
    
    console.log(`Cache miss: query response for user ${userId}`);
    
    // Cache miss - get vehicle profile (try cache first)
    let vehicleProfile: VehicleProfile | null = null;
    if (!skipCache) {
      vehicleProfile = await cacheVehicleProfile(userId, supabaseClient);
    }
    
    // Call original function
    console.log('Calling original Barry function...');
    const originalResponse = await callOriginalBarryFunction(
      new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(requestBody)
      }),
      supabaseClient
    );
    
    // Parse original response
    const originalData = await originalResponse.json();
    
    // Process and cache the response (unless bypassed)
    let finalResponse: CachedResponse;
    
    if (!skipCache) {
      finalResponse = await processResponse(
        originalData,
        userId,
        query,
        vehicleProfile,
        startTime
      );
    } else {
      // Return original response without caching
      finalResponse = {
        content: originalData.content || originalData.message || 'No response available',
        manualReferences: originalData.manualReferences || [],
        metadata: {
          cached: false,
          cacheHit: false,
          originalResponseTime: Date.now() - startTime
        }
      };
    }
    
    const endTime = Date.now();
    console.log(`Original response processed in ${endTime - startTime}ms`);
    
    return new Response(JSON.stringify(finalResponse), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-skip-cache',
        'X-Cache-Status': skipCache ? 'BYPASSED' : 'MISS',
        'X-Response-Time': `${endTime - startTime}ms`,
      },
    });
    
  } catch (error) {
    console.error('Error in cached Barry function:', error);
    
    // Try to fall back to original function
    try {
      console.log('Falling back to original Barry function...');
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabaseClient = createClient(supabaseUrl, supabaseKey);
      
      const fallbackResponse = await callOriginalBarryFunction(request, supabaseClient);
      
      // Add fallback headers
      const fallbackData = await fallbackResponse.json();
      return new Response(JSON.stringify({
        ...fallbackData,
        metadata: {
          cached: false,
          cacheHit: false,
          fallback: true,
          originalError: error.message
        }
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-skip-cache',
          'X-Cache-Status': 'FALLBACK',
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      });
      
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      
      return new Response(JSON.stringify({
        error: 'Both cached and original functions failed',
        details: error.message,
        fallbackError: fallbackError.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-skip-cache',
          'X-Cache-Status': 'ERROR',
        },
      });
    }
  }
}

// Health check endpoint
async function handleHealthCheck(): Promise<Response> {
  const stats = cache.getStats();
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cache: {
      type: 'memory',
      stats,
      hitRate: stats.hits + stats.misses > 0 
        ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(2) + '%'
        : '0%'
    },
    version: '1.0.0'
  };
  
  return new Response(JSON.stringify(healthData), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// Main serve function
serve(async (request: Request) => {
  const url = new URL(request.url);
  
  // Health check endpoint
  if (url.pathname === '/health' || url.pathname.endsWith('/health')) {
    return handleHealthCheck();
  }
  
  // Main cached request handler
  return handleCachedRequest(request);
});