import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building, DollarSign, BarChart3, Star } from 'lucide-react';

export default function VendorApplication() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactEmail: '',
    phone: '',
    website: '',
    businessAddress: '',
    businessDescription: '',
    tier: 'basic' as 'basic' | 'featured' | 'premium'
  });

  const vendorTiers = [
    {
      id: 'basic' as const,
      name: 'Basic Vendor',
      price: 50,
      description: 'Perfect for small businesses and independent shops',
      features: [
        'Business profile listing',
        'Contact information display',
        'Basic marketplace access',
        'Customer messaging',
        'Basic analytics'
      ]
    },
    {
      id: 'featured' as const,
      name: 'Featured Vendor',
      price: 100,
      description: 'Great for established businesses wanting more visibility',
      features: [
        'Everything in Basic',
        'Featured placement in marketplace',
        'Enhanced business profile',
        'Priority customer support',
        'Advanced analytics',
        'Promotional badges'
      ],
      popular: true
    },
    {
      id: 'premium' as const,
      name: 'Premium Vendor',
      price: 150,
      description: 'For tour operators and major businesses',
      features: [
        'Everything in Featured',
        'Premium route/tour hosting',
        'Custom business branding',
        'Lead generation tools',
        'Comprehensive analytics',
        'Dedicated account manager'
      ]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement vendor application submission
    console.log('Vendor application submitted:', formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedTier = vendorTiers.find(tier => tier.id === formData.tier);

  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Become a Commercial Vendor</h1>
          <p className="text-xl text-muted-foreground">
            Join our marketplace and connect with the global Unimog community
          </p>
        </div>

        {/* Tier Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {vendorTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`cursor-pointer transition-all ${
                formData.tier === tier.id
                  ? 'border-primary shadow-lg'
                  : 'hover:shadow-md'
              } ${tier.popular ? 'relative' : ''}`}
              onClick={() => handleInputChange('tier', tier.id)}
            >
              {tier.popular && (
                <Badge className="absolute -top-2 -right-2 bg-primary">
                  Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  {tier.id === 'basic' && <Building className="h-8 w-8 text-primary" />}
                  {tier.id === 'featured' && <BarChart3 className="h-8 w-8 text-primary" />}
                  {tier.id === 'premium' && <Star className="h-8 w-8 text-primary" />}
                </div>
                <CardTitle>{tier.name}</CardTitle>
                <div className="text-2xl font-bold text-primary">
                  ${tier.price}<span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1 h-1 rounded-full bg-primary mt-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Application</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Selected: {selectedTier?.name} (${selectedTier?.price}/month)
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://your-website.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  placeholder="Your business address for customer reference"
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description *</Label>
                <Textarea
                  id="businessDescription"
                  placeholder="Tell us about your business, what services/products you offer, and your experience with Unimogs..."
                  value={formData.businessDescription}
                  onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                  rows={5}
                  required
                />
              </div>

              {/* Application Note */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Application Process</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Applications are reviewed within 2-3 business days</p>
                    <p>• We may contact you for additional information</p>
                    <p>• Once approved, you'll receive billing setup instructions</p>
                    <p>• Your first invoice will be prorated for the current month</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Submit Application
                </Button>
                <Button type="button" variant="outline">
                  Save Draft
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                By submitting this application, you agree to our vendor terms and conditions.
                You will only be charged after approval and setup completion.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}