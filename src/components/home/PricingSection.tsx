
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

// Add named export to match the import in Index.tsx
export const PricingSection = () => {
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
          {/* Free Plan */}
          <div className="border rounded-lg p-8 bg-background flex flex-col">
            <div>
              <h3 className="text-xl font-bold">Basic</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold">Free</span>
              </div>
              <p className="text-muted-foreground mb-6">Perfect for new Unimog owners looking to connect.</p>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Community forum access</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Basic trip planning tools</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Public knowledge base</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">Sign Up Free</Button>
          </div>
          
          {/* Pro Plan */}
          <div className="border rounded-lg p-8 bg-primary text-primary-foreground flex flex-col relative">
            <div className="absolute top-0 right-0 bg-yellow-500 text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              POPULAR
            </div>
            <div>
              <h3 className="text-xl font-bold">Pro Member</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-sm">/month</span>
              </div>
              <p className="text-primary-foreground/80 mb-6">For enthusiasts who want deeper access and features.</p>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-yellow-300 mr-2" />
                <span>Everything in Basic</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-yellow-300 mr-2" />
                <span>Premium knowledge resources</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-yellow-300 mr-2" />
                <span>Advanced route planning</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-yellow-300 mr-2" />
                <span>1-on-1 messaging with members</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-yellow-300 mr-2" />
                <span>Parts marketplace access</span>
              </div>
            </div>
            
            <Button variant="secondary" className="w-full">Start 14-day Trial</Button>
          </div>
          
          {/* Premium Plan */}
          <div className="border rounded-lg p-8 bg-background flex flex-col">
            <div>
              <h3 className="text-xl font-bold">Elite Owner</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-sm">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">For serious enthusiasts and professionals.</p>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Everything in Pro Member</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Priority technical support</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Early access to new features</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Exclusive technical documents</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Dealer network access</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">Upgrade to Elite</Button>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need a custom solution for your business or group?
          </p>
          <Button variant="link">Contact us for enterprise pricing</Button>
        </div>
      </div>
    </section>
  );
};

// Also export as default for backward compatibility
export default PricingSection;
