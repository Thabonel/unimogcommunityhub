
import { Card, CardContent } from '@/components/ui/card';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      initials: 'GB',
      name: 'Geoff Barton',
      vehicle: "U1700L Owner - Melbourne, Australia",
      testimonial: "Site looked damned good by the way. Great idea."
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hear From Our Community</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what other Unimog owners have to say about our platform.
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
