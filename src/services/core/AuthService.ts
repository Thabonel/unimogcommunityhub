/**
 * Enterprise-grade Authentication Service
 * Handles token management, session persistence, and auth state
 */

import { SupabaseService } from './SupabaseService';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { EventEmitter } from 'events';

// Types
export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  metadata?: Record<string, any>;
}

export interface AuthResult {
  success: boolean;
  user?: User | null;
  session?: Session | null;
  error?: AuthError | Error;
  message?: string;
  retryable?: boolean;
  requiresReauth?: boolean;
  retryAfter?: number;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

// Token Manager for handling refresh logic
class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private refreshPromise: Promise<AuthResult> | null = null;
  
  constructor(private authService: AuthService) {}
  
  scheduleTokenRefresh(expiresIn: number) {
    // Clear any existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    
    // Refresh 5 minutes before expiry (or 10 seconds min)
    const refreshIn = Math.max((expiresIn - 300) * 1000, 10000);
    
    console.log(`Scheduling token refresh in ${refreshIn / 1000} seconds`);
    
    this.refreshTimer = setTimeout(() => {
      this.performRefresh();
    }, refreshIn);
  }
  
  private async performRefresh() {
    // Prevent concurrent refreshes
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    
    this.refreshPromise = this.authService.refreshSession();
    
    try {
      const result = await this.refreshPromise;
      if (!result.success && result.requiresReauth) {
        console.error('Token refresh failed, re-authentication required');
        this.authService.emit('auth:reauth-required');
      }
    } finally {
      this.refreshPromise = null;
    }
  }
  
  cancelRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

// Session Store for persistence
class SessionStore {
  private readonly STORAGE_KEY = 'app_session';
  
  async save(session: Session): Promise<void> {
    try {
      const encrypted = this.encrypt(JSON.stringify(session));
      localStorage.setItem(this.STORAGE_KEY, encrypted);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }
  
  async load(): Promise<Session | null> {
    try {
      const encrypted = localStorage.getItem(this.STORAGE_KEY);
      if (!encrypted) return null;
      
      const decrypted = this.decrypt(encrypted);
      const session = JSON.parse(decrypted);
      
      // Validate session hasn't expired
      if (session.expires_at && new Date(session.expires_at) < new Date()) {
        this.clear();
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Failed to load session:', error);
      this.clear();
      return null;
    }
  }
  
  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  // Simple encryption (in production, use a proper encryption library)
  private encrypt(data: string): string {
    return btoa(data);
  }
  
  private decrypt(data: string): string {
    return atob(data);
  }
}

// Main Authentication Service
export class AuthService extends EventEmitter {
  private static instance: AuthService;
  private supabaseService: SupabaseService;
  private tokenManager: TokenManager;
  private sessionStore: SessionStore;
  private currentState: AuthState = {
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null
  };
  
  private constructor() {
    super();
    this.supabaseService = SupabaseService.getInstance();
    this.tokenManager = new TokenManager(this);
    this.sessionStore = new SessionStore();
    this.initialize();
  }
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  
  private async initialize() {
    try {
      // Set up auth state change listener
      this.supabaseService.getClient().auth.onAuthStateChange(
        this.handleAuthStateChange.bind(this)
      );
      
      // Try to restore session
      const { data: { session } } = await this.supabaseService
        .getClient()
        .auth
        .getSession();
      
      if (session) {
        this.updateState({
          user: session.user,
          session,
          isAuthenticated: true,
          isLoading: false
        });
        
        // Schedule token refresh
        if (session.expires_in) {
          this.tokenManager.scheduleTokenRefresh(session.expires_in);
        }
      } else {
        this.updateState({ isLoading: false });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      this.updateState({ 
        isLoading: false, 
        error: error as Error 
      });
    }
  }
  
  private handleAuthStateChange(event: string, session: Session | null) {
    console.log('Auth state change:', event);
    
    switch (event) {
      case 'SIGNED_IN':
        this.updateState({
          user: session?.user || null,
          session,
          isAuthenticated: true,
          error: null
        });
        
        if (session?.expires_in) {
          this.tokenManager.scheduleTokenRefresh(session.expires_in);
        }
        
        this.emit('auth:signed-in', session);
        break;
        
      case 'SIGNED_OUT':
        this.tokenManager.cancelRefresh();
        this.sessionStore.clear();
        this.updateState({
          user: null,
          session: null,
          isAuthenticated: false,
          error: null
        });
        this.emit('auth:signed-out');
        break;
        
      case 'TOKEN_REFRESHED':
        if (session) {
          this.updateState({ session });
          this.sessionStore.save(session);
          
          if (session.expires_in) {
            this.tokenManager.scheduleTokenRefresh(session.expires_in);
          }
          
          this.emit('auth:token-refreshed', session);
        }
        break;
        
      case 'USER_UPDATED':
        if (session?.user) {
          this.updateState({ user: session.user });
          this.emit('auth:user-updated', session.user);
        }
        break;
    }
  }
  
  private updateState(updates: Partial<AuthState>) {
    this.currentState = { ...this.currentState, ...updates };
    this.emit('auth:state-change', this.currentState);
  }
  
  // Sign in with email and password
  async signIn(credentials: SignInCredentials): Promise<AuthResult> {
    try {
      this.updateState({ isLoading: true, error: null });
      
      // Validate input
      if (!this.validateCredentials(credentials)) {
        throw new Error('Invalid email or password format');
      }
      
      const { data, error } = await this.supabaseService
        .getClient()
        .auth
        .signInWithPassword(credentials);
      
      if (error) {
        return this.handleAuthError(error);
      }
      
      if (data.session) {
        await this.sessionStore.save(data.session);
      }
      
      return {
        success: true,
        user: data.user,
        session: data.session
      };
    } catch (error) {
      return this.handleAuthError(error as Error);
    } finally {
      this.updateState({ isLoading: false });
    }
  }
  
  // Sign up with email and password
  async signUp(credentials: SignUpCredentials): Promise<AuthResult> {
    try {
      this.updateState({ isLoading: true, error: null });
      
      // Validate input
      if (!this.validateCredentials(credentials)) {
        throw new Error('Invalid email or password format');
      }
      
      const { data, error } = await this.supabaseService
        .getClient()
        .auth
        .signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: credentials.metadata
          }
        });
      
      if (error) {
        return this.handleAuthError(error);
      }
      
      return {
        success: true,
        user: data.user,
        session: data.session,
        message: 'Please check your email to confirm your account'
      };
    } catch (error) {
      return this.handleAuthError(error as Error);
    } finally {
      this.updateState({ isLoading: false });
    }
  }
  
  // Sign out
  async signOut(): Promise<AuthResult> {
    try {
      this.updateState({ isLoading: true });
      
      this.tokenManager.cancelRefresh();
      this.sessionStore.clear();
      
      const { error } = await this.supabaseService
        .getClient()
        .auth
        .signOut();
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error) {
      return this.handleAuthError(error as Error);
    } finally {
      this.updateState({ isLoading: false });
    }
  }
  
  // Refresh session with retry logic
  async refreshSession(): Promise<AuthResult> {
    const maxRetries = 3;
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const { data, error } = await this.supabaseService
          .getClient()
          .auth
          .refreshSession();
        
        if (!error && data.session) {
          await this.sessionStore.save(data.session);
          
          return {
            success: true,
            session: data.session,
            user: data.user
          };
        }
        
        lastError = error;
      } catch (error) {
        lastError = error as Error;
      }
      
      // Exponential backoff between retries
      if (attempt < maxRetries - 1) {
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }
    
    // All retries failed
    return {
      success: false,
      error: lastError || new Error('Session refresh failed'),
      requiresReauth: true
    };
  }
  
  // Reset password
  async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .auth
        .resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
      
      if (error) {
        return this.handleAuthError(error);
      }
      
      return {
        success: true,
        message: 'Password reset email sent. Please check your inbox.'
      };
    } catch (error) {
      return this.handleAuthError(error as Error);
    }
  }
  
  // Update password
  async updatePassword(newPassword: string): Promise<AuthResult> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .auth
        .updateUser({ password: newPassword });
      
      if (error) {
        return this.handleAuthError(error);
      }
      
      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      return this.handleAuthError(error as Error);
    }
  }
  
  // Get current auth state
  getState(): AuthState {
    return { ...this.currentState };
  }
  
  // Get current user
  getUser(): User | null {
    return this.currentState.user;
  }
  
  // Get current session
  getSession(): Session | null {
    return this.currentState.session;
  }
  
  // Check if authenticated
  isAuthenticated(): boolean {
    return this.currentState.isAuthenticated;
  }
  
  // Validate credentials
  private validateCredentials(credentials: SignInCredentials): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(credentials.email)) {
      return false;
    }
    
    if (credentials.password.length < 6) {
      return false;
    }
    
    return true;
  }
  
  // Handle auth errors with categorization
  private handleAuthError(error: Error | AuthError): AuthResult {
    const errorMessage = error.message || 'Authentication failed';
    
    // Categorize error
    if (errorMessage.includes('Invalid login credentials')) {
      return {
        success: false,
        error,
        message: 'Invalid email or password',
        retryable: false
      };
    }
    
    if (errorMessage.includes('Email not confirmed')) {
      return {
        success: false,
        error,
        message: 'Please confirm your email address',
        retryable: false
      };
    }
    
    if (errorMessage.includes('Network')) {
      return {
        success: false,
        error,
        message: 'Network error. Please check your connection.',
        retryable: true
      };
    }
    
    if (errorMessage.includes('rate limit')) {
      return {
        success: false,
        error,
        message: 'Too many attempts. Please try again later.',
        retryable: true,
        retryAfter: 60000 // 1 minute
      };
    }
    
    // Generic error
    return {
      success: false,
      error,
      message: 'An error occurred. Please try again.',
      retryable: true
    };
  }
  
  // Utility delay function
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}