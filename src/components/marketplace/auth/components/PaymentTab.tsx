
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
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border p-4 rounded-md">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Default</span>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Billing Address</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>John Doe</p>
            <p>123 Main Street</p>
            <p>Apt 4B</p>
            <p>New York, NY 10001</p>
            <p>United States</p>
          </div>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.href = '/marketplace/account-settings?tab=address'}>
            Update Billing Address
          </Button>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Transaction Preferences</h3>
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
                      <p className="max-w-xs">Your default currency is determined by your address settings. To change it, update your country in the Address & Currency tab.</p>
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
              Determined by your address settings. <Button variant="link" className="h-auto p-0" onClick={() => window.location.href = '/marketplace/account-settings?tab=address'}>Update address &rarr;</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Save Payment Info</p>
                <p className="text-sm text-muted-foreground">
                  Securely store payment details for future transactions
                </p>
              </div>
              <Switch checked={true} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
