
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { PricingSection } from '@/components/home/PricingSection';
import { FreeTrialCTA } from '@/components/home/FreeTrialCTA';
import SimpleMap from '@/components/SimpleMap';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      
      <div className="container mx-auto my-12">
        <h2 className="text-3xl font-bold text-center mb-6">Explore Unimog Routes</h2>
        <p className="text-center text-muted-foreground mb-8">
          Plan and visualize your next adventure with our interactive map
        </p>
        <SimpleMap 
          height="500px"
          center={[-98.5, 39.8]} // Center of USA
          zoom={3.5}
        />
      </div>
      
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FreeTrialCTA />
    </Layout>
  );
};

export default Index;
