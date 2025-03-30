
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building2, TrendingUp, Users, Shield, MessageSquare, MapPin } from 'lucide-react';

const About = () => {
  return (
    <Layout isLoggedIn={false}>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-unimog-800 dark:text-unimog-200">About Unimog Hub</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The ultimate community platform for Unimog enthusiasts and owners around the world.
          </p>
          <Separator className="my-8" />
          
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-unimog-700 dark:text-unimog-300">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Unimog Hub, our mission is to connect Unimog enthusiasts, simplify vehicle maintenance, 
                and enable memorable off-road adventures. We believe that Unimog vehicles represent the pinnacle 
                of engineering excellence and off-road capability, and we're dedicated to building a thriving 
                community around these remarkable machines.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-unimog-700 dark:text-unimog-300">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card className="offroad-card">
                  <CardContent className="pt-6">
                    <Building2 className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
                    <p className="text-muted-foreground">
                      Buy and sell Unimog parts and accessories with other community members.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="offroad-card">
                  <CardContent className="pt-6">
                    <Shield className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Knowledge Base</h3>
                    <p className="text-muted-foreground">
                      Access comprehensive Unimog manuals and user-contributed repair guides.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="offroad-card">
                  <CardContent className="pt-6">
                    <MapPin className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Trip Planning</h3>
                    <p className="text-muted-foreground">
                      Discover and share off-road routes perfect for your Unimog's specifications.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="offroad-card">
                  <CardContent className="pt-6">
                    <MessageSquare className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Community</h3>
                    <p className="text-muted-foreground">
                      Connect with fellow Unimog enthusiasts and share your experiences.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-unimog-700 dark:text-unimog-300">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Unimog Hub was founded in 2023 by a group of passionate Unimog owners who recognized 
                the need for a dedicated platform. What started as a small forum has evolved into a 
                comprehensive ecosystem for everything Unimog-related.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, our community spans across the globe, bringing together thousands of enthusiasts 
                who share knowledge, experiences, and a common passion for these incredible vehicles.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-unimog-700 dark:text-unimog-300">Join Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Whether you're a long-time Unimog owner, considering your first purchase, or simply 
                fascinated by these versatile vehicles, we welcome you to join our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-primary">Sign Up Today</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
