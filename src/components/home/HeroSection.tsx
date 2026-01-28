import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { SITE_IMAGES } from '@/config/images';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 md:py-32 pb-28 md:pb-40">
      <div className="absolute inset-0 overflow-hidden">
        <picture>
          <source srcSet={SITE_IMAGES.heroMain} type="image/webp" />
          <source srcSet={SITE_IMAGES.heroMainFallback} type="image/jpeg" />
          <img
            src={SITE_IMAGES.heroMainFallback}
            alt="Unimog off-road adventure"
            className="object-cover object-center w-full h-full"
            loading="eager"
            fetchPriority="high"
            onError={(e) => {
              console.error('Hero image failed to load');
              e.currentTarget.style.display = 'none';
            }}
          />
        </picture>
        <div className="absolute inset-0 bg-military-black/50 mix-blend-multiply"></div>
      </div>
      <div className="container relative text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-6 text-white md:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            {t('hero.subtitle')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <Button size="lg" className="bg-military-olive hover:bg-military-olive/90 text-white w-full" asChild>
              <Link to="/signup?plan=trial">
                {t('hero.cta_claim')}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" className="bg-camo-brown hover:bg-camo-brown/90 text-white w-full" asChild>
              <Link to="/vendors/byond-rv">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Shop Byond RV
              </Link>
            </Button>
            <Button size="lg" className="bg-amazon-orange hover:bg-amazon-orange/90 text-white w-full" asChild>
              <Link to="/shop">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Unimog Shop
              </Link>
            </Button>
            <Button size="lg" className="bg-military-tan text-military-black hover:bg-military-tan/90 w-full" asChild>
              <Link to="/community/members">
                {t('hero.cta_featured')}
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