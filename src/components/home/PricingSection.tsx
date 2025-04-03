
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export const PricingSection = () => {
  return (
    <section className="py-16 md:py-24 terrain-gradient text-white">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join Our Community?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-2xl font-bold mb-2">Monthly</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-sm">/month</span>
              </div>
              <ul className="text-sm space-y-2 mb-6 text-left">
                <li>✓ Full access to all features</li>
                <li>✓ Community forums access</li>
                <li>✓ Knowledge base</li>
                <li>✓ Marketplace listings</li>
              </ul>
              <Link to="/signup">
                <Button size="lg" className="w-full bg-white text-unimog-800 hover:bg-white/90">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 text-white relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary px-4 py-1 rounded-full text-xs font-bold">
              Best Value
            </div>
            <CardContent className="pt-6 pb-6">
              <h3 className="text-2xl font-bold mb-2">Annual</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$99.90</span>
                <span className="text-sm">/year</span>
              </div>
              <p className="text-sm mb-2 font-medium text-white/80">Save with 2 months free!</p>
              <ul className="text-sm space-y-2 mb-6 text-left">
                <li>✓ All monthly plan features</li>
                <li>✓ Priority support</li>
                <li>✓ Early access to new features</li>
                <li>✓ Extended trip planning tools</li>
              </ul>
              <Link to="/signup">
                <Button size="lg" className="w-full bg-white text-unimog-800 hover:bg-white/90">
                  Save With Annual
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-2xl font-bold mb-2">Business</h3>
              <div className="mb-4">
                <span className="text-xl font-bold">Custom Pricing</span>
              </div>
              <ul className="text-sm space-y-2 mb-6 text-left">
                <li>✓ All annual plan features</li>
                <li>✓ Multiple user accounts</li>
                <li>✓ Dedicated support</li>
                <li>✓ API access & custom integrations</li>
              </ul>
              <Link to="/contact">
                <Button size="lg" className="w-full bg-white text-unimog-800 hover:bg-white/90">
                  <Building2 className="mr-2 h-4 w-4" />
                  Contact Us
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <Link to="/signup">
          <Button size="lg" className="bg-white text-unimog-800 hover:bg-white/90 w-full sm:w-auto">
            Sign Up Now
          </Button>
        </Link>
      </div>
    </section>
  );
};

// Also export as default for backward compatibility
export default PricingSection;
