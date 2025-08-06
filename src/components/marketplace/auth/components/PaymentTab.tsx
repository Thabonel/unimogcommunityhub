
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/user';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { getCurrencySymbol } from '@/utils/currencyUtils';

export const PaymentTab = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setUserProfile(data as UserProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const currencyCode = userProfile?.currency || 'USD';
  const currencySymbol = getCurrencySymbol(currencyCode);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Marketplace Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            The Unimog Marketplace connects buyers and sellers directly. All payment arrangements and transactions are handled between parties - we don't process payments.
          </p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Seller Contact Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Messages</p>
                <p className="text-sm text-muted-foreground">
                  Let buyers contact you through the marketplace
                </p>
              </div>
              <Switch checked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Phone Number</p>
                <p className="text-sm text-muted-foreground">
                  Display your phone number on listings
                </p>
              </div>
              <Switch checked={false} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive emails when buyers are interested
                </p>
              </div>
              <Switch checked={true} />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Preferred Transaction Methods</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Let buyers know your preferred payment methods (for informational purposes only)
          </p>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Cash</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Bank Transfer</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">PayPal</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Other (specify in listing)</span>
            </label>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Display Currency</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="font-medium">Default Currency</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Used for displaying prices in your listings. Buyers and sellers arrange actual payment terms directly.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-3 py-1 bg-muted rounded font-mono">{currencyCode}</span>
                <span className="text-muted-foreground">({currencySymbol})</span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Based on your location. <Button variant="link" className="h-auto p-0" onClick={() => window.location.href = '/marketplace/account-settings?tab=address'}>Update location &rarr;</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
