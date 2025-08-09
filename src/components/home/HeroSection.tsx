import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/site_assets/hero-wheels.jpg" 
          alt="Unimog hero image" 
          className="object-cover object-center w-full h-full"
          loading="eager"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-military-black/70 via-military-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-military-black/20"></div>
      </div>
      {/* Hero Content */}
      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight mb-6 text-white md:text-6xl lg:text-7xl drop-shadow-lg">
            The Ultimate Unimog Community Hub
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/95 max-w-2xl drop-shadow-md">
            Connect with fellow enthusiasts, share knowledge, plan expeditions, and live the Unimog lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-military-olive hover:bg-military-olive/90 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105" 
              asChild
            >
              <Link to="/signup?plan=trial">
                Start Free Trial
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              className="bg-white/95 text-military-black hover:bg-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105" 
              asChild
            >
              <Link to="/signup">
                Join the Community
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;