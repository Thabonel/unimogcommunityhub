
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckout } from '@/hooks/use-checkout';
import { useToast } from '@/hooks/use-toast';

// Add named export to match the import in Index.tsx
export const PricingSection = () => {
  const { user } = useAuth();
  const { redirectToCheckout, isLoading } = useCheckout();
  const { toast } = useToast();
  
  const handleSubscribe = async (planType: 'premium' | 'lifetime') => {
    if (!user) {
      // If user is not logged in, redirect to signup page with plan type
      return;
    }
    
    try {
      await redirectToCheckout(planType);
    } catch (error) {
      toast({
        title: 'Checkout Error',
        description: 'There was a problem processing your subscription. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the Unimog community with a plan that works for you
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Standard Plan */}
          <div className="border rounded-lg p-8 bg-background flex flex-col">
            <div>
              <div className="flex items-center">
                <h3 className="text-xl font-bold">Standard Plan</h3>
              </div>
              <div className="mt-4 mb-1">
                <span className="text-4xl font-bold">$15</span>
                <span className="text-sm">/month</span>
              </div>
              <div className="mb-6">
                <span className="text-sm text-muted-foreground">or $150/year</span>
              </div>
              <p className="text-muted-foreground mb-6">For enthusiasts who want access to all core features.</p>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Full Community Forum Access</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Marketplace Access</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Full Knowledge Base Access</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Trip Planning Module</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Vehicle Management</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Basic AI Assistance</span>
              </div>
            </div>
            
            {user ? (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSubscribe('premium')}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Get Standard'}
              </Button>
            ) : (
              <Link to="/signup?plan=standard">
                <Button variant="outline" className="w-full">Get Standard</Button>
              </Link>
            )}
          </div>
          
          {/* Premium Plan */}
          <div className="border rounded-lg p-8 bg-primary text-primary-foreground flex flex-col relative">
            <div className="absolute top-0 right-0 bg-yellow-500 text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              POPULAR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">Premium Plan</h3>
              </div>
              <div className="mt-4 mb-1">
                <span className="text-4xl font-bold">$25</span>
                <span className="text-sm">/month</span>
              </div>
              <div className="mb-6">
                <span className="text-sm text-primary-foreground/80">or $250/year</span>
              </div>
              <p className="text-primary-foreground/80 mb-6">For serious Unimog enthusiasts who want it all.</p>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-yellow-300 mr-2" />
                <span>Everything in Standard Plan</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-yellow-300 mr-2" />
                <span>Enhanced AI Assistance</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-yellow-300 mr-2" />
                <span>Priority Support</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-yellow-300 mr-2" />
                <span>Exclusive Content</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-yellow-300 mr-2" />
                <span>Enhanced Marketplace Features</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-yellow-300 mr-2" />
                <span>Premium repair manuals</span>
              </div>
            </div>
            
            {user ? (
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => handleSubscribe('premium')}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Go Premium'}
              </Button>
            ) : (
              <Link to="/signup?plan=premium">
                <Button variant="secondary" className="w-full">Go Premium</Button>
              </Link>
            )}
          </div>
          
          {/* Lifetime Plan */}
          <div className="border rounded-lg p-8 bg-background flex flex-col relative overflow-hidden">
            <div className="absolute -right-12 top-6 bg-green-500 text-xs text-white font-bold px-10 py-1 rotate-45">
              BEST VALUE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">Lifetime Plan</h3>
              </div>
              <div className="mt-4 mb-1">
                <span className="text-4xl font-bold">$500</span>
                <span className="text-sm"> one-time</span>
              </div>
              <div className="mb-6">
                <span className="text-sm text-muted-foreground">Never pay again</span>
              </div>
              <p className="text-muted-foreground mb-6">Lifetime access to all premium features.</p>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Everything in Premium Plan</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Lifetime access - no renewals</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Early access to new features</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Community member badge</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Unlimited support</span>
              </div>
            </div>
            
            {user ? (
              <Button 
                variant="outline" 
                className="w-full border-green-500 text-green-700 hover:bg-green-50"
                onClick={() => handleSubscribe('lifetime')}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Get Lifetime Access'}
              </Button>
            ) : (
              <Link to="/signup?plan=lifetime">
                <Button variant="outline" className="w-full border-green-500 text-green-700 hover:bg-green-50">Get Lifetime Access</Button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need a custom solution for your business or group?
          </p>
          <Link to="/contact">
            <Button variant="link">Contact us for enterprise pricing</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Also export as default for backward compatibility
export default PricingSection;
