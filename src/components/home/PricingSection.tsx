
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const PricingSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the Unimog community with a plan that works for you
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-border">
            <CardHeader className="text-center pb-8 pt-6">
              <p className="text-2xl font-bold">Free</p>
              <h3 className="text-4xl font-bold mt-2">$0<span className="text-lg font-normal text-muted-foreground">/month</span></h3>
              <p className="text-sm text-muted-foreground mt-2">Perfect for casual enthusiasts</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Access to community forums</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Basic knowledge base access</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>View marketplace listings</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Limited trip route access</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/signup">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Pro Plan */}
          <Card className="border-2 border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-bold">
              MOST POPULAR
            </div>
            <CardHeader className="text-center pb-8 pt-6">
              <p className="text-2xl font-bold">Pro</p>
              <h3 className="text-4xl font-bold mt-2">$12<span className="text-lg font-normal text-muted-foreground">/month</span></h3>
              <p className="text-sm text-muted-foreground mt-2">For serious Unimog owners</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>All free features</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Unlimited knowledge base access</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Buy & sell in marketplace</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Full trip planning features</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Real-time messaging with other members</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>AI assistance for maintenance</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/signup?plan=trial">Start Free Trial</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

