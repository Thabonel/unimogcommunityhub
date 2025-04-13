
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckout } from '@/hooks/use-checkout';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/use-subscription';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTrial } from '@/hooks/use-trial';

export const PricingSection = () => {
  const { user } = useAuth();
  const { redirectToCheckout, isLoading } = useCheckout();
  const { toast } = useToast();
  const { subscription, hasActiveSubscription } = useSubscription();
  const { trialStatus, startTrial } = useTrial();
  
  const handleSubscribe = async (planType: 'standard' | 'lifetime') => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to subscribe to this plan',
        variant: 'destructive',
      });
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

  const handleStartTrial = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to start your free trial',
        variant: 'destructive',
      });
      return;
    }
    
    const success = await startTrial();
    if (success) {
      // Redirect to success page with trial flag
      window.location.href = '/subscription/success?trial=true';
    }
  };

  // Check if user has the current plan
  const hasCurrentPlan = (planType: string): boolean => {
    if (!hasActiveSubscription()) return false;
    return subscription?.level === planType;
  };

  const tiers = [
    {
      name: 'Standard',
      price: '$17',
      interval: 'month',
      description: 'Everything you need for your Unimog journey',
      features: [
        'Full community access',
        'Complete knowledge base',
        'Create marketplace listings',
        'Advanced trip planning tools',
        'Direct messaging',
        'Manual uploads',
        'Priority support',
        'Enhanced AI assistance',
      ],
      limitations: [],
      ctaText: trialStatus === 'active' ? 'Current Trial' : trialStatus === 'expired' ? 'Subscribe Now' : '2-Month Free Trial',
      ctaLink: '/signup?plan=standard',
      mostPopular: true,
      planType: 'standard' as const
    },
    {
      name: 'Lifetime',
      price: '$500',
      interval: 'one-time',
      description: 'Permanent access to all features',
      features: [
        'Everything in Standard plan',
        'Lifetime access - never pay again',
        'Unlimited manual uploads',
        'Featured marketplace listings',
        'Early access to new features',
        'Community badge',
        'Dedicated support',
      ],
      limitations: [],
      ctaText: 'Get Lifetime Access',
      ctaLink: '/signup?plan=lifetime',
      mostPopular: false,
      planType: 'lifetime' as const
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/50" id="pricing">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the Unimog community with a plan that works for you
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className={`border rounded-lg p-8 ${tier.mostPopular ? 
                'bg-primary text-primary-foreground shadow-md' : 
                'bg-card text-card-foreground'} flex flex-col relative`}
            >
              {tier.mostPopular && (
                <div className="absolute -top-4 left-0 w-full flex justify-center">
                  <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              {hasCurrentPlan(tier.planType) && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    Current Plan
                  </span>
                </div>
              )}
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                </div>
                <div className="mt-4 mb-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-sm">/{tier.interval}</span>
                </div>
                <div className="mb-6">
                  <span className={`text-sm ${tier.mostPopular ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {tier.interval === 'month' ? 'or $170/year (save 17%)' : 'never pay again'}
                  </span>
                </div>
                <p className={`${tier.mostPopular ? 'text-primary-foreground/80' : 'text-muted-foreground'} mb-6`}>
                  {tier.description}
                </p>
              </div>
              
              <div className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start">
                    <Check className={`h-5 w-5 ${tier.mostPopular ? 'text-yellow-300' : 'text-green-500'} shrink-0 mr-2`} />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                
                {tier.limitations.map((limitation) => (
                  <div key={limitation} className="flex items-start text-muted-foreground">
                    <span className="text-sm">{limitation}</span>
                  </div>
                ))}
              </div>
              
              {/* Button logic */}
              {user ? (
                hasCurrentPlan(tier.planType) ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={tier.mostPopular ? "secondary" : "outline"}
                          className="w-full cursor-default"
                          disabled
                        >
                          Current Plan
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>You're currently subscribed to this plan</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  tier.planType === 'standard' && trialStatus === 'active' ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant={tier.mostPopular ? "secondary" : "outline"}
                            className="w-full cursor-help"
                            disabled
                          >
                            <div className="flex items-center gap-1">
                              Active Trial <Info className="h-3.5 w-3.5" />
                            </div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>You're currently on a free trial of this plan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    tier.planType === 'standard' && trialStatus === 'not_started' ? (
                      <Button 
                        variant={tier.mostPopular ? "secondary" : "outline"}
                        className="w-full"
                        onClick={handleStartTrial}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Processing...' : '2-Month Free Trial'}
                      </Button>
                    ) : (
                      <Button 
                        variant={tier.mostPopular ? "secondary" : "outline"}
                        className={`w-full ${!tier.mostPopular ? 'border-green-500 text-green-700 hover:bg-green-50' : ''}`}
                        onClick={() => handleSubscribe(tier.planType)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Processing...' : tier.ctaText}
                      </Button>
                    )
                  )
                )
              ) : (
                <Link to={tier.ctaLink} className="w-full">
                  <Button 
                    variant={tier.mostPopular ? "secondary" : "outline"}
                    className={`w-full ${!tier.mostPopular ? 'border-green-500 text-green-700 hover:bg-green-50' : ''}`}
                  >
                    {tier.ctaText}
                  </Button>
                </Link>
              )}
            </div>
          ))}
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

export default PricingSection;
