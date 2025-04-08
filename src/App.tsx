
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import SubscriptionGuard from '@/components/SubscriptionGuard';
import TrialBanner from '@/components/TrialBanner';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import SubscriptionSuccess from '@/pages/SubscriptionSuccess';
import SubscriptionCanceled from '@/pages/SubscriptionCanceled';
import TravelPlanner from '@/pages/TravelPlanner';
import { AuthProvider } from '@/contexts/AuthContext';
import WebhookHandler from '@/components/webhook/WebhookHandler';
import Contact from '@/pages/Contact';
import Index from '@/pages/Index';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user?.id) {
          await checkAdminStatus(currentSession.user.id);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user?.id) {
        await checkAdminStatus(currentSession.user.id);
      }
    };
    
    checkSession();

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching admin status:", error);
        return;
      }

      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/knowledge" element={<div>Knowledge Page</div>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/pricing" element={<div>Pricing Page</div>} />
          <Route path="/signup" element={<div>Signup Page</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/travel-planner" element={<TravelPlanner />} />
          <Route path="/api/trip-webhook/:endpointId" element={<WebhookHandler />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/subscription/canceled" element={<SubscriptionCanceled />} />
          <Route
            path="/account"
            element={
              <SubscriptionGuard>
                <div>Account Page</div>
              </SubscriptionGuard>
            }
          />
          <Route
            path="/admin/*"
            element={
              isAdmin ? (
                <div>
                  <Routes>
                    <Route path="site-configuration" element={<div>Site Configuration</div>} />
                    <Route path="users" element={<div>Users Admin</div>} />
                    <Route path="*" element={<Navigate to="site-configuration" />} />
                  </Routes>
                </div>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
        <TrialBanner />
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
