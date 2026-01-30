import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, Heart, Building, ArrowRight, Users, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/hooks/use-subscription';

const NewPricing = () => {
  const { subscription, isLoading } = useSubscription();

  // Check if user already has access
  const hasAccess = subscription?.isActive || false;
  const accessReason = subscription ? subscription.isVerified ? 'verified' :
    subscription.supporterTier ? 'supporter' :
    subscription.legacySubscriber ? 'founder' : null : null;

  const tiers = [
    {
      id: 'verified',
      name: 'Verified Unimog Owner',
      price: 'FREE',
      subtitle: 'Forever',
      description: 'Verify ownership once, access everything',
      icon: <Shield className="h-8 w-8 text-military-green" />,
      iconBg: 'bg-military-green/10',
      features: [
        'Complete access to Barry AI Mechanic',
        '45+ workshop manuals & parts catalogs',
        'Trip planning & GPX tools',
        'Community forums & marketplace',
        'Vehicle management dashboard',
        'Maintenance tracking & reminders'
      ],
      cta: 'Start Verification',
      ctaLink: '/verify-ownership',
      badge: null,
      mostPopular: true,
    },
    {
      id: 'supporter',
      name: 'Community Supporter',
      price: '$5-25',
      subtitle: '/month',
      description: 'Support the community (voluntary)',
      icon: <Heart className="h-8 w-8 text-red-500" />,
      iconBg: 'bg-red-50',
      features: [
        'Everything in Verified Owner',
        'Supporter badge on profile',
        'Public recognition page',
        'Priority community support',
        'Help keep the platform ad-free',
        '❤️ Thank you for your support!'
      ],
      cta: 'Support Community',
      ctaLink: '/supporter-signup',
      badge: { text: 'Optional', variant: 'secondary' as const },
      mostPopular: false,
    },
    {
      id: 'vendor',
      name: 'Commercial Vendor',
      price: '$50-150',
      subtitle: '/month',
      description: 'For businesses & tour operators',
      icon: <Building className="h-8 w-8 text-blue-600" />,
      iconBg: 'bg-blue-50',
      features: [
        'Featured marketplace listings',
        'Premium route/tour hosting',
        'Business profile & contact info',
        'Analytics & performance metrics',
        '3 tiers: Basic, Featured, Premium',
        '🚀 Grow your Unimog business'
      ],
      cta: 'Apply as Vendor',
      ctaLink: '/vendor-application',
      badge: { text: 'Business', variant: 'outline' as const },
      mostPopular: false,
    }
  ];

  return (
    <Layout>
      <div className="container py-12">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-unimog-800 dark:text-unimog-200">
            Join the Unimog Community
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            <strong className="text-military-green">Verify your Unimog ownership for FREE access</strong> to all features.
          </p>
          <p className="text-lg text-muted-foreground">
            Optional supporter tiers help fund community resources and keep the platform ad-free.
          </p>

          {/* Current Status */}
          {hasAccess && (
            <Card className="mt-8 max-w-md mx-auto border-green-200 bg-green-50/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-700">You have access!</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {accessReason === 'verified' && 'Verified Unimog Owner'}
                  {accessReason === 'supporter' && `Community Supporter (${subscription?.supporterTier})`}
                  {accessReason === 'founder' && 'Founder Member'}
                </div>
                <Link to="/dashboard">
                  <Button className="mt-3" size="sm">
                    Go to Dashboard <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={`relative h-full ${
                tier.mostPopular
                  ? 'border-military-green/50 shadow-lg scale-105'
                  : 'hover:shadow-md transition-shadow'
              }`}
            >
              {tier.mostPopular && (
                <div className="absolute -top-4 left-0 w-full flex justify-center">
                  <Badge className="bg-military-green text-white px-6 py-2 font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}

              {tier.badge && (
                <div className="absolute -top-2 -right-2">
                  <Badge variant={tier.badge.variant}>{tier.badge.text}</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-full ${tier.iconBg} flex items-center justify-center mx-auto mb-4`}>
                  {tier.icon}
                </div>
                <CardTitle className="text-xl mb-2">{tier.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.subtitle && (
                    <span className="text-muted-foreground text-lg">{tier.subtitle}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-military-green shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={tier.ctaLink} className="block">
                  <Button
                    className={`w-full ${
                      tier.mostPopular
                        ? 'bg-military-green hover:bg-military-green/90'
                        : ''
                    }`}
                    variant={tier.mostPopular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Existing Members Note */}
        <Card className="max-w-4xl mx-auto mb-12 border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-100 rounded-full">
                <Crown className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-amber-900">Existing Members</h3>
                <p className="text-sm text-amber-800 mb-3">
                  Current monthly and lifetime subscribers maintain full access with enhanced "Founder" privileges.
                  Thank you for supporting us during our early days!
                </p>
                <Link to="/settings">
                  <Button variant="outline" size="sm" className="text-amber-700 border-amber-300">
                    Manage your account →
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Join the Growing Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <div className="text-3xl font-bold text-military-green mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Verified Owners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-military-green mb-1">45+</div>
              <div className="text-sm text-muted-foreground">Workshop Manuals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-military-green mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Barry AI Support</div>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            Questions about verification or need help? We're here for you.
          </p>
          <Link to="/contact">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NewPricing;