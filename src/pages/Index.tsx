
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import PricingSection from '@/components/home/PricingSection';

const Index = () => {
  return (
    <Layout isLoggedIn={false}>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
    </Layout>
  );
};

export default Index;
