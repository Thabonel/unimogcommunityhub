
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function CallToAction() {
  const { t, ready } = useTranslation();

  if (!ready) {
    return (
      <section className="py-16 bg-military-olive/10">
        <div className="container flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-military-olive/10">
      <div className="container text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('cta.title')}</h2>
        <p className="text-xl max-w-2xl mx-auto text-muted-foreground">
          {t('cta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/signup?plan=trial">
            <Button size="lg" className="rounded-md">
              {t('cta.button_claim')}
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="lg" variant="outline" className="rounded-md">
              {t('cta.button_trial')}
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          {t('cta.disclaimer')}
        </p>
      </div>
    </section>
  );
}
