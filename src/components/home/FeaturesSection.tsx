
import { Card, CardContent } from '@/components/ui/card';
import {
  ShoppingCart,
  BookOpen,
  Map,
  Users,
  MessageSquare,
  Shield
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FeaturesSection = () => {
  const { t } = useTranslation();
  const featureData = [
    {
      icon: <ShoppingCart className="h-10 w-10 text-white" />,
      title: t('features.marketplace.title'),
      description: t('features.marketplace.description'),
      backgroundImage: "/images-hero/marketplace.png"
    },
    {
      icon: <BookOpen className="h-10 w-10 text-white" />,
      title: t('features.knowledge_base.title'),
      description: t('features.knowledge_base.description'),
      backgroundImage: "/images-hero/knowledge-base.png"
    },
    {
      icon: <Map className="h-10 w-10 text-white" />,
      title: t('features.trip_planner.title'),
      description: t('features.trip_planner.description'),
      backgroundImage: "/images-hero/trip-planner.png"
    },
    {
      icon: <Users className="h-10 w-10 text-white" />,
      title: t('features.community_forums.title'),
      description: t('features.community_forums.description'),
      backgroundImage: "/images-hero/community-forums.png"
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-white" />,
      title: t('features.direct_messaging.title'),
      description: t('features.direct_messaging.description'),
      backgroundImage: "/images-hero/messaging.png"
    },
    {
      icon: <Shield className="h-10 w-10 text-white" />,
      title: t('features.barry_ai.title'),
      description: t('features.barry_ai.description'),
      backgroundImage: "/images-hero/ai-assistance.png"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('features.section_title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.section_subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureData.map((feature, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 group h-[300px]"
              style={{
                backgroundImage: `url(${feature.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Title at the top */}
              <div className="absolute top-0 left-0 right-0 z-20 bg-military-green/90 backdrop-blur-sm px-4 py-3">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider text-center" 
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                  {feature.title}
                </h3>
              </div>
              
              {/* Minimal bottom gradient overlay with soft edge */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
              
              {/* Description at the bottom */}
              <CardContent className="absolute bottom-0 left-0 right-0 z-10 p-4 pb-3">
                <p className="text-white/95 text-sm leading-tight text-center" 
                   style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
