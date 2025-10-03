
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import PricingSection from '@/components/home/PricingSection';
import { VideoSection } from '@/components/home/VideoSection';
import { CallToAction } from '@/components/homepage/CallToAction';
import { logger } from '@/utils/logger';

const Index = () => {
  logger.debug('Index component rendering', { component: 'Index' });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <VideoSection videoId="KovbKkfiImw" />
        <CallToAction />
      </div>
    </Layout>
  );
};

export default Index;
