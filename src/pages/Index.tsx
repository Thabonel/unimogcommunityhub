
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronRight, 
  ShoppingCart, 
  BookOpen, 
  Map, 
  Users, 
  MessageSquare, 
  Shield,
  Building2
} from 'lucide-react';

const Index = () => {
  const [mockLoggedIn] = useState(false);
  
  const features = [
    {
      icon: <ShoppingCart className="h-10 w-10 text-primary" />,
      title: "Marketplace",
      description: "Buy and sell Unimog parts and accessories with other community members."
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Knowledge Base",
      description: "Access comprehensive Unimog manuals and user-contributed repair guides."
    },
    {
      icon: <Map className="h-10 w-10 text-primary" />,
      title: "Trip Planning",
      description: "Discover and share off-road routes perfect for your Unimog's specifications."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Community Forums",
      description: "Connect with fellow Unimog enthusiasts and share your experiences."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Real-time Messaging",
      description: "Stay connected with other drivers while on expeditions."
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "AI Assistance",
      description: "Get expert help from our AI that knows everything about Unimogs."
    }
  ];

  return (
    <Layout isLoggedIn={mockLoggedIn}>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 terrain-gradient overflow-hidden">
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        <div className="container relative text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              The Ultimate Unimog Community Hub
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Connect with fellow enthusiasts, share knowledge, plan expeditions, and get the most from your Unimog.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-unimog-800 hover:bg-white/90 w-full sm:w-auto">
                  Join the Community
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need in One Place</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform brings together all the tools and resources Unimog owners need to maintain, upgrade, and enjoy their vehicles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="offroad-card border-0">
                <CardContent className="pt-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hear From Our Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what other Unimog owners have to say about our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="offroad-card border border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-unimog-200 flex items-center justify-center text-unimog-800 font-semibold">JD</div>
                  <div className="ml-3">
                    <h4 className="font-medium">John Decker</h4>
                    <p className="text-sm text-muted-foreground">Unimog U5000 Owner</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "This community has been invaluable for maintaining my U5000. I've found rare parts through the marketplace and the knowledge base helped me solve issues mechanics couldn't figure out."
                </p>
              </CardContent>
            </Card>
            
            <Card className="offroad-card border border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-unimog-200 flex items-center justify-center text-unimog-800 font-semibold">SK</div>
                  <div className="ml-3">
                    <h4 className="font-medium">Sarah Kim</h4>
                    <p className="text-sm text-muted-foreground">Unimog 435 Owner</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The trip planning feature is incredible. I've discovered amazing routes I never knew existed, all verified to accommodate my Unimog's dimensions. The real-time messaging saved us when we got stuck."
                </p>
              </CardContent>
            </Card>
            
            <Card className="offroad-card border border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-unimog-200 flex items-center justify-center text-unimog-800 font-semibold">MR</div>
                  <div className="ml-3">
                    <h4 className="font-medium">Michael Reiter</h4>
                    <p className="text-sm text-muted-foreground">Unimog 406 Owner</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "As a new Unimog owner, the AI assistance blew me away. It answered all my questions about my 406 in detail, and the community forum connected me with owners who had the same model."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
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
    </Layout>
  );
};

export default Index;
