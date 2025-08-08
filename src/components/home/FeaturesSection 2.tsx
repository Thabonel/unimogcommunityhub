
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingCart, 
  BookOpen, 
  Map, 
  Users, 
  MessageSquare, 
  Shield
} from 'lucide-react';

const featureData = [
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

export const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need in One Place</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform brings together all the tools and resources Unimog owners need to maintain, upgrade, and enjoy their vehicles.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureData.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow transition-all duration-300">
              <CardContent className="pt-6 flex flex-col items-center text-center p-6">
                <div className="mb-5">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
