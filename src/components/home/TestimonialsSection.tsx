
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export const TestimonialsSection = () => {
  const { t } = useTranslation();
  const testimonials = [
    {
      initials: 'GB',
      name: 'Geoff Barton',
      vehicle: t('testimonials.geoff.vehicle'),
      testimonial: t('testimonials.geoff.quote')
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('testimonials.section_title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('testimonials.section_subtitle')}
          </p>
        </div>
        
        <div className="flex justify-center">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-border/50 max-w-md w-full">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold">
                    {testimonial.initials}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.vehicle}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "{testimonial.testimonial}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
