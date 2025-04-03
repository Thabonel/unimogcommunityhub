
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { PricingSection } from '@/components/home/PricingSection';
import { FreeTrialCTA } from '@/components/home/FreeTrialCTA';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FreeTrialCTA />
      </Layout>
    </QueryClientProvider>
  );
};

export default Index;
