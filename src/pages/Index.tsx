
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { PricingSection } from '@/components/home/PricingSection';
import { FreeTrialCTA } from '@/components/home/FreeTrialCTA';

const Index = () => {
  console.log('Index component is rendering');
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FreeTrialCTA />
      </div>
    </Layout>
  );
};

export default Index;
