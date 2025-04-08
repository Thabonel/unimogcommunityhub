import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Account from '@/pages/Account';
import Admin from '@/pages/Admin';
import Home from '@/pages/Home';
import Knowledge from '@/pages/Knowledge';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import Signup from '@/pages/Signup';
import Login from '@/pages/Login';
import Pricing from '@/pages/Pricing';
import NotFound from '@/pages/NotFound';
import SubscriptionGuard from '@/components/SubscriptionGuard';
import TrialBanner from '@/components/TrialBanner';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { SiteConfiguration } from '@/components/admin/SiteConfiguration';
import { UsersAdmin } from '@/components/admin/UsersAdmin';
import SubscriptionSuccess from '@/pages/SubscriptionSuccess';
import SubscriptionCanceled from '@/pages/SubscriptionCanceled';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast()

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching admin status:", error);
          return;
        }

        setIsAdmin(data?.is_admin || false);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [session, supabase]);

  return (
    <>
      <Router>
        <TrialBanner />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/subscription/canceled" element={<SubscriptionCanceled />} />
          <Route
            path="/account"
            element={
              <SubscriptionGuard>
                <Account session={session} />
              </SubscriptionGuard>
            }
          />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <Admin>
                  <Routes>
                    <Route path="site-configuration" element={<SiteConfiguration />} />
                    <Route path="users" element={<UsersAdmin />} />
                    <Route path="*" element={<Navigate to="site-configuration" />} />
                  </Routes>
                </Admin>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
