
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { FreeTrialCTA } from './FreeTrialCTA';

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/2828a9e2-f57a-4737-b4b6-a24cfc14a95a.png" 
          alt="Unimog off-roading through forest terrain" 
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-military-black/50 mix-blend-multiply"></div>
      </div>
      <div className="container relative text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            The Ultimate Unimog Community Hub
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            Connect with fellow enthusiasts, share knowledge, plan expeditions, and get the most from your Unimog.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <FreeTrialCTA />
            <Link to="/signup">
              <Button size="lg" className="bg-military-tan text-military-black hover:bg-military-tan/90 w-full sm:w-auto">
                Join the Community
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
