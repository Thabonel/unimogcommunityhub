
import { Card, CardContent } from '@/components/ui/card';
import { features } from '@/data/featureData';

const FeatureCard = ({ feature }: { feature: typeof features[0] }) => {
  return (
    <Card className="offroad-card border-0 hover:shadow-lg transition-all duration-300 h-full">
      <CardContent className="pt-6 flex flex-col h-full">
        <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
          {feature.icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
      </CardContent>
    </Card>
  );
};

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Also export as default for backward compatibility
export default FeaturesSection;
