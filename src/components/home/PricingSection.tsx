import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Shield, Heart, Building, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

const PricingSection = () => {
  const { ready } = useTranslation();

  // Wait for translations to load before rendering
  if (!ready) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Free for Unimog Owners</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access the complete UnimogCommunityHub by verifying your Unimog ownership.
            No monthly fees, no subscriptions - just proof that you're part of the community.
          </p>
        </div>

        {/* Verification Banner */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="bg-military-green/10 rounded-lg p-8 border-2 border-military-green/30 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-military-green" />
            <h3 className="text-2xl font-bold mb-2">Quick VIN Verification</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Upload a photo of your vehicle registration or title. Our system automatically extracts
              your VIN and verifies your Unimog ownership in minutes.
            </p>
            <Badge variant="outline" className="text-military-green border-military-green">
              🤖 Powered by OCR Technology
            </Badge>
          </div>
        </div>

        {/* Barry Section */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="bg-primary/5 rounded-lg p-8 border border-primary/20 flex items-center gap-6">
            <img src="/barry-avatar.png" alt="Barry AI Mechanic" className="h-32 w-32 rounded-full flex-shrink-0 object-cover" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Meet Barry, Your AI Mechanic</h3>
              <p className="text-muted-foreground">
                Get instant answers from 45+ Unimog workshop manuals, parts catalogs, and technical documentation.
                Barry knows your Unimog inside and out - from maintenance schedules to complex repairs.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Verified Owners - Main Option */}
          <Card className="border-2 border-military-green relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-military-green text-white px-3 py-1 text-xs font-bold">
              RECOMMENDED
            </div>
            <CardHeader className="text-center pb-8 pt-6">
              <Shield className="h-12 w-12 mx-auto mb-4 text-military-green" />
              <p className="text-2xl font-bold">Verified Unimog Owner</p>
              <h3 className="text-4xl font-bold mt-2 text-military-green">
                FREE
                <span className="text-lg font-normal text-muted-foreground ml-2">Forever</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-2">Verify ownership once, access everything</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-military-green" />
                  <span>Complete access to Barry AI Mechanic</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-military-green" />
                  <span>45+ workshop manuals & parts catalogs</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-military-green" />
                  <span>Trip planning & GPX tools</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-military-green" />
                  <span>Community forums & marketplace</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-military-green" />
                  <span>Vehicle management dashboard</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-military-green" />
                  <span>Maintenance tracking & reminders</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-military-green hover:bg-military-green/90">
                <Link to="/verify">Start Verification</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Community Supporter */}
          <Card className="border-2 border-border">
            <CardHeader className="text-center pb-8 pt-6">
              <Heart className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-2xl font-bold">Community Supporter</p>
              <h3 className="text-4xl font-bold mt-2">
                $5-25
                <span className="text-lg font-normal text-muted-foreground">/month</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-2">Support the community (voluntary)</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-primary" />
                  <span>Everything in Verified Owner</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-primary" />
                  <span>Supporter badge on profile</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-primary" />
                  <span>Public recognition page</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-primary" />
                  <span>Priority community support</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-primary" />
                  <span>Help keep the platform ad-free</span>
                </div>
                <div className="text-center pt-2">
                  <Badge variant="outline" className="text-red-500 border-red-500">
                    ❤️ Thank you for your support!
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/support">Support Community</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Commercial Vendor */}
          <Card className="border-2 border-border">
            <CardHeader className="text-center pb-8 pt-6">
              <Building className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <p className="text-2xl font-bold">Commercial Vendor</p>
              <h3 className="text-4xl font-bold mt-2">
                $50-150
                <span className="text-lg font-normal text-muted-foreground">/month</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-2">For businesses & tour operators</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-primary" />
                  <span>Featured marketplace listings</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-primary" />
                  <span>Premium route/tour hosting</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-primary" />
                  <span>Business profile & contact info</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-primary" />
                  <span>Analytics & performance metrics</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-primary" />
                  <span>3 tiers: Basic, Featured, Premium</span>
                </div>
                <div className="text-center pt-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    🚀 Grow your Unimog business
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/vendor-apply">Apply as Vendor</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Legacy Subscriber Notice */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-amber-800">Existing Members</h3>
            <p className="text-amber-700">
              Current monthly and lifetime subscribers maintain full access with enhanced "Founder" privileges.
              Thank you for supporting us during our early days!
              <Link to="/account" className="underline font-medium ml-1">Manage your account →</Link>
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-bold mb-2">What documents can I use for verification?</h4>
              <p className="text-muted-foreground">Vehicle registration, title/deed, insurance documents, or clear photos showing your Unimog's VIN plate.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-bold mb-2">How long does verification take?</h4>
              <p className="text-muted-foreground">Most verifications are automatic (instant) using OCR. Manual reviews take 24-48 hours maximum.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-bold mb-2">What if I don't own a Unimog yet?</h4>
              <p className="text-muted-foreground">You can browse as a guest or become a community supporter. Verification is only required for full platform access.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-bold mb-2">Is my data secure?</h4>
              <p className="text-muted-foreground">Yes! Documents are processed securely and only used for verification. We don't store or share your personal information.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;