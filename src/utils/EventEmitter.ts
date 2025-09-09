/**
 * Simple browser-compatible EventEmitter implementation
 */

export type EventListener = (...args: any[]) => void;

export class EventEmitter {
  private events: Map<string, EventListener[]> = new Map();
  private maxListeners = 10;

  /**
   * Add an event listener
   */
  on(event: string, listener: EventListener): this {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    const listeners = this.events.get(event)!;
    listeners.push(listener);
    
    // Warn about memory leaks
    if (listeners.length > this.maxListeners) {
      console.warn(`EventEmitter: Possible memory leak detected. ${listeners.length} listeners added for event "${event}". Use setMaxListeners() to increase limit.`);
    }
    
    return this;
  }

  /**
   * Add a one-time event listener
   */
  once(event: string, listener: EventListener): this {
    const onceWrapper = (...args: any[]) => {
      this.off(event, onceWrapper);
      listener(...args);
    };
    
    this.on(event, onceWrapper);
    return this;
  }

  /**
   * Remove an event listener
   */
  off(event: string, listener: EventListener): this {
    const listeners = this.events.get(event);
    if (!listeners) return this;
    
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
      
      // Clean up empty event arrays
      if (listeners.length === 0) {
        this.events.delete(event);
      }
    }
    
    return this;
  }

  /**
   * Emit an event
   */
  emit(event: string, ...args: any[]): boolean {
    const listeners = this.events.get(event);
    if (!listeners || listeners.length === 0) {
      return false;
    }
    
    // Call all listeners
    listeners.forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        console.error(`EventEmitter: Error in listener for event "${event}":`, error);
      }
    });
    
    return true;
  }

  /**
   * Remove all listeners for an event, or all events if no event specified
   */
  removeAllListeners(event?: string): this {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }

  /**
   * Get all listeners for an event
   */
  listeners(event: string): EventListener[] {
    return this.events.get(event)?.slice() || [];
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.length || 0;
  }

  /**
   * Get all event names
   */
  eventNames(): string[] {
    return Array.from(this.events.keys());
  }

  /**
   * Set the maximum number of listeners before warning
   */
  setMaxListeners(max: number): this {
    this.maxListeners = max;
    return this;
  }

  /**
   * Get the maximum number of listeners
   */
  getMaxListeners(): number {
    return this.maxListeners;
  }
}