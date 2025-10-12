
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export const TestimonialsSection = () => {
  const { t } = useTranslation();
  const testimonials = [
    {
      initials: 'GB',
      name: t('testimonials.geoff.name'),
      vehicle: t('testimonials.geoff.vehicle'),
      location: t('testimonials.geoff.location'),
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
                <div className="mb-4">
                  <h4 className="font-bold text-lg mb-1">
                    {testimonial.initials} — {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.vehicle} ({testimonial.location})
                  </p>
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
