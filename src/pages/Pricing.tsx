
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Bot, Map, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { useCurrencyPricing, formatPriceWithIndicator } from '@/hooks/use-currency-pricing';
import { getAnnualSavingsText, TIER_FEATURES } from '@/config/pricing';
import { CurrencySelector } from '@/components/pricing/CurrencySelector';

const Pricing = () => {
  const { pricing, userCurrency, userCountry, isLoading, setPricingCurrency } = useCurrencyPricing();

  const tiers = [
    {
      name: 'Monthly',
      price: formatPriceWithIndicator(pricing.monthly.amount, pricing.monthly.currency, pricing.monthly.isConverted),
      interval: 'month',
      description: 'Flexible monthly access to Unimog Community Hub',
      features: [
        'Full community access',
        'Complete knowledge base',
        'Advanced trip planning tools'
      ],
      aiFeatures: [
        { icon: <Bot className="h-5 w-5" />, name: 'Barry, Your AI Mechanic', description: 'Get expert maintenance and repair guidance' },
        { icon: <Map className="h-5 w-5" />, name: 'Barry, AI Mechanic', description: 'Expert maintenance and repair guidance' }
      ],
      ctaText: 'Start Monthly Plan',
      ctaLink: '/signup?plan=monthly',
      mostPopular: false,
    },
    {
      name: 'Annual',
      price: formatPriceWithIndicator(pricing.annual.amount, pricing.annual.currency, pricing.annual.isConverted),
      interval: 'year',
      description: 'Save over two months with annual billing',
      features: [
        'Full community access',
        'Complete knowledge base',
        'Advanced trip planning tools',
        getAnnualSavingsText(pricing.annual.currency, pricing.monthly.amount, pricing.annual.amount)
      ],
      aiFeatures: [
        { icon: <Bot className="h-5 w-5" />, name: 'Barry, Your AI Mechanic', description: 'Get expert maintenance and repair guidance' },
        { icon: <Map className="h-5 w-5" />, name: 'Barry, AI Mechanic', description: 'Expert maintenance and repair guidance' }
      ],
      ctaText: 'Save with Annual Plan',
      ctaLink: '/signup?plan=annual',
      mostPopular: true,
    },
    {
      name: 'Lifetime',
      price: formatPriceWithIndicator(pricing.lifetime.amount, pricing.lifetime.currency, pricing.lifetime.isConverted),
      interval: 'one-time',
      description: 'Permanent access to all features',
      features: [
        'Full community access',
        'Complete knowledge base',
        'Advanced trip planning tools',
        'Lifetime site access'
      ],
      aiFeatures: [
        { icon: <Bot className="h-5 w-5" />, name: 'Barry, Your AI Mechanic', description: 'Get expert maintenance and repair guidance' },
        { icon: <Map className="h-5 w-5" />, name: 'Barry, AI Mechanic', description: 'Expert maintenance and repair guidance' }
      ],
      ctaText: 'Get Lifetime Access',
      ctaLink: '/signup?plan=lifetime',
      mostPopular: false,
    }
  ];

  const faqs = [
    {
      question: 'Is there a free trial?',
      answer: 'Yes! Every new user gets a 45-day free trial with full access to all features of the Unimog Community Hub, including AI assistants. No credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards and PayPal for monthly and annual plans.'
    },
    {
      question: 'What\'s included in the Lifetime membership?',
      answer: 'The Lifetime membership provides permanent access to all current and future features of the Unimog Community Hub, including unlimited access to Barry, your AI Mechanic assistant.'
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Yes, you can upgrade or change your plan at any time. Contact our support team for assistance.'
    }
  ];

  return (
    <Layout isLoggedIn={false}>
      <div className="container py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-unimog-800 dark:text-unimog-200">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Get started with our <span className="font-semibold text-primary">45-day free trial</span>. No credit card required.
          </p>
          <p className="text-base text-muted-foreground">
            Choose a plan that works for your Unimog journey after your trial.
          </p>
          {userCountry && !isLoading && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Prices shown in {userCurrency} for {userCountry}
                {pricing.monthly.isConverted && <span className="ml-1">(converted from AUD)</span>}
              </p>
              <CurrencySelector
                currentCurrency={userCurrency}
                onCurrencyChange={setPricingCurrency}
                userCountry={userCountry}
                isConverted={pricing.monthly.isConverted}
              />
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center mt-3">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Detecting your currency...</span>
            </div>
          )}
        </div>

        {/* AI Assistant Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Barry, Your AI Mechanic</h3>
              </div>
              <p className="text-muted-foreground">
                Get 24/7 expert guidance on Unimog maintenance and repairs from our specialized AI assistant.
                Barry can help diagnose issues, provide step-by-step repair instructions, and recommend the right tools and parts for any job.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">Technical diagnostics and solutions</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">Step-by-step repair guidance</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">Parts and tools recommendations</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Map className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Barry, AI Mechanic</h3>
              </div>
              <p className="text-muted-foreground">
                Plan the perfect expedition with our AI travel assistant designed specifically for Unimog adventures.
                Barry provides expert maintenance advice, troubleshooting guidance, and technical support for your Unimog.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">Customized off-road route planning</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">Terrain and vehicle compatibility analysis</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">Weather-aware expedition scheduling</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          {tiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={`offroad-card relative ${tier.mostPopular ? 'border-primary/50 shadow-lg' : ''}`}
            >
              {tier.mostPopular && (
                <div className="absolute -top-4 left-0 w-full flex justify-center">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Best Value
                  </span>
                </div>
              )}
              
              <CardContent className={`pt-8 ${tier.mostPopular ? 'pb-8' : 'pb-6'}`}>
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.interval && (
                    <span className="text-muted-foreground">/{tier.interval}</span>
                  )}
                </div>
                <p className="text-muted-foreground mb-6">{tier.description}</p>
                
                <Separator className="my-6" />
                
                <div className="mb-6">
                  <p className="font-medium text-sm uppercase text-muted-foreground mb-3">Features</p>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <p className="font-medium text-sm uppercase text-muted-foreground mb-3">AI Assistants</p>
                  <div className="space-y-4">
                    {tier.aiFeatures.map((feature, idx) => (
                      <div key={idx} className="bg-primary/5 p-3 rounded-lg">
                        <div className="flex items-center mb-1">
                          <div className="mr-2 text-primary">{feature.icon}</div>
                          <span className="font-medium text-sm">{feature.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground pl-7">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Link to={tier.ctaLink}>
                  <Button 
                    className={`w-full ${tier.mostPopular ? 'bg-primary' : ''}`}
                    variant={tier.mostPopular ? 'default' : 'outline'}
                  >
                    {tier.ctaText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border pb-6">
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium mb-4">Need more information?</h3>
            <Link to="/contact">
              <Button variant="outline">Contact Our Team</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
