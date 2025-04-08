
import { Card, CardContent } from '@/components/ui/card';
import { features } from '@/data/featureData';
import { motion } from 'framer-motion';

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="card-hover card-with-gradient border-0 h-full">
        <CardContent className="pt-6 flex flex-col h-full p-6">
          <div className="mb-5 p-3 bg-primary/10 rounded-full w-fit text-primary">
            {feature.icon}
          </div>
          <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
          <p className="text-muted-foreground">{feature.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Everything You Need in One Place</h2>
          <p className="section-subtitle">
            Our platform brings together all the tools and resources Unimog owners need to maintain, upgrade, and enjoy their vehicles.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Also export as default for backward compatibility
export default FeaturesSection;
