import { Shield, Truck, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export const WhyJoinSection = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: <Shield className="h-12 w-12 text-military-green" />,
      title: t('whyJoin.verified.title'),
      description: t('whyJoin.verified.description')
    },
    {
      icon: <Truck className="h-12 w-12 text-military-green" />,
      title: t('whyJoin.garage.title'),
      description: t('whyJoin.garage.description')
    },
    {
      icon: <Wrench className="h-12 w-12 text-military-green" />,
      title: t('whyJoin.help.title'),
      description: t('whyJoin.help.description')
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('whyJoin.section_title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-2 border-border text-center">
              <CardContent className="pt-8 pb-6 px-6">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoinSection;
