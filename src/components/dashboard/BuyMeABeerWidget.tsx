import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Beer, Plus, Minus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface DonationStats {
  total_this_month: number;
  count_this_month: number;
  total_all_time: number;
  count_all_time: number;
}

export function BuyMeABeerWidget() {
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const beerAmounts = [
    { amount: 5, label: '$5' },
    { amount: 10, label: '$10' },
    { amount: 20, label: '$20' },
  ];

  useEffect(() => {
    fetchDonationStats();
  }, []);

  const fetchDonationStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_donation_stats');
      if (!error && data) {
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching donation stats:', err);
    }
  };

  const addAmount = (amount: number) => {
    setTotal(prev => prev + amount);
  };

  const clearTotal = () => {
    setTotal(0);
  };

  const handleDonate = async () => {
    if (total < 3) {
      toast({
        title: "Minimum donation",
        description: "Minimum donation amount is $3",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('[Donation] Starting donation flow, amount:', total);
      console.log('[Donation] User logged in:', !!user);

      const response = await supabase.functions.invoke('create-checkout', {
        body: {
          type: 'donation',
          amount: total,
          metadata: {
            donor_name: donorName || null,
            donor_email: donorEmail || null,
            message: message || null,
            is_anonymous: !donorName,
          }
        }
      });

      console.log('[Donation] Full response:', response);

      if (response.error) {
        const errorMessage = response.data?.error || response.error.message || 'Unknown error';
        console.error('[Donation] Function error:', errorMessage, response);
        throw new Error(errorMessage);
      }

      const data = response.data;
      console.log('[Donation] Data:', data);

      if (!data?.success) {
        console.error('[Donation] Function returned error:', data);
        throw new Error(data?.error || 'Checkout session creation failed');
      }

      if (!data?.url) {
        throw new Error('No checkout URL returned');
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error('[Donation] Error:', err);
      toast({
        title: "Donation failed",
        description: err.message || "Could not process donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Beer className="h-5 w-5 text-amber-600" />
          </div>
          <CardTitle className="text-lg text-amber-900">Buy Me a Beer</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-amber-800">
          If you find the site useful, please donate if you can afford it.
        </p>

        {/* Beer buttons */}
        <div className="flex gap-2">
          {beerAmounts.map((beer) => (
            <Button
              key={beer.amount}
              variant="outline"
              size="sm"
              onClick={() => addAmount(beer.amount)}
              className="flex-1 border-amber-300 hover:bg-amber-100 hover:border-amber-400"
            >
              <Plus className="h-3 w-3 mr-1" />
              {beer.label}
            </Button>
          ))}
        </div>

        {/* Total display */}
        <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-amber-200">
          <span className="text-sm font-medium text-amber-900">Total:</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-amber-700">${total}</span>
            {total > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearTotal}
                className="h-6 w-6 p-0 text-amber-500 hover:text-amber-700"
              >
                <Minus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Optional details toggle */}
        {total > 0 && (
          <>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-amber-600 hover:text-amber-800 underline"
            >
              {showDetails ? 'Hide details' : 'Add a message (optional)'}
            </button>

            {showDetails && (
              <div className="space-y-3 pt-2">
                <div>
                  <Label htmlFor="donor-name" className="text-xs text-amber-700">
                    Your name (leave blank for anonymous)
                  </Label>
                  <Input
                    id="donor-name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Anonymous"
                    className="h-8 text-sm border-amber-200 focus:border-amber-400"
                  />
                </div>
                {!user && (
                  <div>
                    <Label htmlFor="donor-email" className="text-xs text-amber-700">
                      Email (optional, for receipt)
                    </Label>
                    <Input
                      id="donor-email"
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-8 text-sm border-amber-200 focus:border-amber-400"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="message" className="text-xs text-amber-700">
                    Message (optional)
                  </Label>
                  <Input
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Thanks for the great site!"
                    className="h-8 text-sm border-amber-200 focus:border-amber-400"
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Donate button */}
        <Button
          onClick={handleDonate}
          disabled={total < 3 || isLoading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Beer className="h-4 w-4 mr-2" />
              {total > 0 ? `Donate $${total}` : 'Tap amounts above'}
            </>
          )}
        </Button>

        {/* Social proof */}
        {stats && stats.count_this_month > 0 && (
          <p className="text-xs text-center text-amber-600">
            {stats.count_this_month} beer{stats.count_this_month !== 1 ? 's' : ''} this month!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
