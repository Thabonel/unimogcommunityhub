
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const tiers = [
    {
      name: 'Premium',
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
      ctaText: '2-Month Free Trial',
      ctaLink: '/signup?plan=premium',
      mostPopular: true,
    },
    {
      name: 'Lifetime',
      price: '$500',
      interval: 'one-time',
      description: 'Permanent access to all premium features',
      features: [
        'Everything in Premium plan',
        'Lifetime access - never pay again',
        'Unlimited manual uploads',
        'Featured marketplace listings',
        'Early access to new features',
        'Premium community badge',
        'Dedicated support',
      ],
      limitations: [],
      ctaText: 'Get Lifetime Access',
      ctaLink: '/signup?plan=lifetime',
      mostPopular: false,
    },
  ];

  const faqs = [
    {
      question: 'Is there a free trial?',
      answer:
        'We offer a 2-month free trial for new users on the Premium plan, allowing you to explore all features before committing.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards, PayPal, and bank transfers for annual enterprise plans.',
    },
    {
      question: 'How do refunds work?',
      answer:
        "If you're not satisfied with our service, you can request a refund within 14 days of your initial purchase.",
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer:
        'Yes, you save 20% when choosing annual billing compared to monthly billing on the Premium plan.',
    },
    {
      question: 'What happens after my free trial ends?',
      answer:
        'After your 2-month free trial ends, you will be automatically subscribed to the Premium plan unless you cancel beforehand.',
    },
  ];

  return (
    <Layout isLoggedIn={false}>
      <div className="container py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-unimog-800 dark:text-unimog-200">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose the plan that works best for your Unimog journey. Start with a 2-month free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {tiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={`offroad-card relative ${tier.mostPopular ? 'border-primary/50 shadow-lg' : ''}`}
            >
              {tier.mostPopular && (
                <div className="absolute -top-4 left-0 w-full flex justify-center">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
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
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  
                  {tier.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start text-muted-foreground">
                      <X className="h-5 w-5 shrink-0 mr-2" />
                      <span className="text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>
                
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
