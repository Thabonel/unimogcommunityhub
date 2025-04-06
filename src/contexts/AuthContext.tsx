
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { sendWelcomeEmail } from '@/utils/email/orderEmails';
import { ensureLifetimePlan } from '@/services/subscriptionService';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  sendWelcomeEmail: (email: string, name?: string) => Promise<{
    data: any | null;
    error: any | null;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Ensure the user has a lifetime subscription if they're authenticated
        if (session?.user) {
          try {
            await ensureLifetimePlan(session.user.id);
          } catch (error) {
            console.error("Error ensuring lifetime plan:", error);
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Auth session retrieved:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Ensure the user has a lifetime subscription if they're authenticated
      if (session?.user) {
        try {
          await ensureLifetimePlan(session.user.id);
        } catch (error) {
          console.error("Error ensuring lifetime plan:", error);
        }
      }
      
      setIsLoading(false);
    }).catch(error => {
      console.error("Error getting auth session:", error);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      
      if (result.error) {
        toast({
          title: "Login failed",
          description: result.error.message,
          variant: "destructive",
        });
      } else if (result.data.user) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${result.data.user.email}!`,
        });
      }
      
      return result;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
    try {
      const result = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback`,
          data: metadata
        },
      });
      
      if (result.error) {
        toast({
          title: "Signup failed",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        // If signup was successful, we can send a custom welcome email in addition
        // to the verification email that Supabase sends automatically
        if (result.data?.user) {
          try {
            await sendWelcomeEmail(email, metadata?.full_name);
            // Ensure the user is enrolled in lifetime plan immediately upon signup
            await ensureLifetimePlan(result.data.user.id);
          } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
            // We don't want to fail signup if just the welcome email fails
          }
        }
      }
      
      return result;
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      // First clear the local state before calling supabase.auth.signOut()
      setUser(null);
      setSession(null);
      
      // Then perform the actual signout operation
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      // We don't use navigate here anymore, we'll handle redirects at the component level
      // Navigation will be handled in the components using this hook
    } catch (error: any) {
      toast({
        title: "Error",
        description: "There was a problem logging you out",
        variant: "destructive",
      });
      console.error("Logout error:", error);
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    sendWelcomeEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
