
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
    icon: <ShoppingCart className="h-10 w-10 text-white" />,
    title: "Marketplace",
    description: "Buy and sell Unimog parts and accessories with other community members.",
    backgroundImage: "/images-hero/marketplace.png"
  },
  {
    icon: <BookOpen className="h-10 w-10 text-white" />,
    title: "Knowledge Base",
    description: "Access comprehensive Unimog manuals and user-contributed repair guides.",
    backgroundImage: "/images-hero/knowledge-base.png"
  },
  {
    icon: <Map className="h-10 w-10 text-white" />,
    title: "Trip Planning",
    description: "Discover and share off-road routes perfect for your Unimog's specifications.",
    backgroundImage: "/images-hero/trip-planner.png"
  },
  {
    icon: <Users className="h-10 w-10 text-white" />,
    title: "Community Forums",
    description: "Connect with fellow Unimog enthusiasts and share your experiences.",
    backgroundImage: "/images-hero/community-forums.png"
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-white" />,
    title: "Real-time Messaging",
    description: "Stay connected with other drivers while on expeditions.",
    backgroundImage: "/images-hero/messaging.png"
  },
  {
    icon: <Shield className="h-10 w-10 text-white" />,
    title: "AI Assistance",
    description: "Get expert help from our AI that knows everything about Unimogs.",
    backgroundImage: "/images-hero/ai-assistance.png"
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
            <Card 
              key={index} 
              className="relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 group"
              style={{
                backgroundImage: `url(${feature.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-300" />
              
              <CardContent className="relative z-10 pt-6 flex flex-col items-center text-center p-6 h-full min-h-[250px] justify-center">
                <div className="mb-5 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-white/90">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
