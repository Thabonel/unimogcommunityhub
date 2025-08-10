import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const HeroSection = () => {
  // Use environment-based Supabase URL ONLY - no fallbacks per AUTH_ERROR_PREVENTION.md
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  
  // Validate environment variable is present
  if (!supabaseUrl) {
    console.error('VITE_SUPABASE_URL is not configured. Hero image will not load.');
    return null; // Or render a fallback component
  }
  
  const heroImageUrl = `${supabaseUrl}/storage/v1/object/public/site_assets/2828a9e2-f57a-4737-b4b6-a24cfc14a95a.png`;
  
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={heroImageUrl}
          alt="Unimog off-roading through forest terrain" 
          className="object-cover object-center w-full h-full"
          loading="eager"
          onError={(e) => {
            console.error('Hero image failed to load');
            // Fallback to a solid color if image fails
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-military-black/50 mix-blend-multiply"></div>
      </div>
      <div className="container relative text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-6 text-white md:text-6xl">
            The Ultimate Unimog Community Hub
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            Connect with fellow enthusiasts, share knowledge, plan expeditions, and get the most from your Unimog.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-military-olive hover:bg-military-olive/90 text-white w-full sm:w-auto group" asChild>
              <Link to="/signup?plan=trial">
                Start 45-Day Free Trial
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" className="bg-military-tan text-military-black hover:bg-military-tan/90 w-full sm:w-auto" asChild>
              <Link to="/signup">
                Join the Community
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;