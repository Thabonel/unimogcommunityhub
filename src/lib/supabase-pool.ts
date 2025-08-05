import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConnectionPoolManager } from '@/utils/database-retry';

/**
 * Supabase connection pool configuration
 */
export interface PoolConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  maxConnections?: number;
  connectionTimeout?: number;
  idleTimeout?: number;
}

/**
 * Enhanced Supabase client with connection pooling
 */
export class SupabasePool {
  private clients: SupabaseClient[] = [];
  private availableClients: SupabaseClient[] = [];
  private waitingQueue: Array<(client: SupabaseClient) => void> = [];
  private poolManager: ConnectionPoolManager;
  
  constructor(private config: PoolConfig) {
    this.poolManager = new ConnectionPoolManager(config.maxConnections || 10);
    this.initializePool();
  }
  
  /**
   * Initialize the connection pool
   */
  private initializePool() {
    const poolSize = this.config.maxConnections || 10;
    
    for (let i = 0; i < poolSize; i++) {
      const client = createClient(
        this.config.supabaseUrl,
        this.config.supabaseAnonKey,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          },
          global: {
            headers: {
              'x-connection-id': `pool-${i}`,
            },
          },
          db: {
            schema: 'public',
          },
        }
      );
      
      this.clients.push(client);
      this.availableClients.push(client);
    }
  }
  
  /**
   * Acquire a client from the pool
   */
  async acquire(): Promise<SupabaseClient> {
    // If there's an available client, return it immediately
    if (this.availableClients.length > 0) {
      const client = this.availableClients.pop()!;
      return client;
    }
    
    // Otherwise, wait for a client to become available
    return new Promise((resolve) => {
      this.waitingQueue.push(resolve);
    });
  }
  
  /**
   * Release a client back to the pool
   */
  release(client: SupabaseClient) {
    // If there are waiting requests, give the client to them
    if (this.waitingQueue.length > 0) {
      const resolve = this.waitingQueue.shift()!;
      resolve(client);
    } else {
      // Otherwise, add it back to the available pool
      this.availableClients.push(client);
    }
  }
  
  /**
   * Execute an operation with a pooled client
   */
  async withClient<T>(
    operation: (client: SupabaseClient) => Promise<T>
  ): Promise<T> {
    const client = await this.acquire();
    try {
      return await operation(client);
    } finally {
      this.release(client);
    }
  }
  
  /**
   * Get pool statistics
   */
  getStats() {
    return {
      totalClients: this.clients.length,
      availableClients: this.availableClients.length,
      waitingRequests: this.waitingQueue.length,
      busyClients: this.clients.length - this.availableClients.length,
    };
  }
  
  /**
   * Close all connections in the pool
   */
  async close() {
    // Clear the waiting queue
    this.waitingQueue.forEach((resolve) => {
      resolve(null as any); // Force resolution with null
    });
    this.waitingQueue = [];
    
    // Clear all clients
    this.clients = [];
    this.availableClients = [];
  }
}

// Singleton instance
let poolInstance: SupabasePool | null = null;

/**
 * Get or create the Supabase pool instance
 */
export function getSupabasePool(): SupabasePool {
  if (!poolInstance) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key must be provided');
    }
    
    poolInstance = new SupabasePool({
      supabaseUrl,
      supabaseAnonKey,
      maxConnections: 10,
      connectionTimeout: 30000,
      idleTimeout: 60000,
    });
  }
  
  return poolInstance;
}

/**
 * Execute a database operation with automatic pooling
 */
export async function withPooledClient<T>(
  operation: (client: SupabaseClient) => Promise<T>
): Promise<T> {
  const pool = getSupabasePool();
  return pool.withClient(operation);
}