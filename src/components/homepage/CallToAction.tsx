
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function CallToAction() {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-military-olive/10">
      <div className="container text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('cta.title')}</h2>
        <p className="text-xl max-w-2xl mx-auto text-muted-foreground">
          {t('cta.subtitle')}
        </p>
        <div className="pt-4">
          <Link to="/signup">
            <Button size="lg" className="rounded-md">
              {t('cta.button')}
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          {t('cta.trial_text')}
        </p>
      </div>
    </section>
  );
}
