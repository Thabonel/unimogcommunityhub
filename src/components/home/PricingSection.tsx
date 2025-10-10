
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useCurrencyPricing, formatPriceWithIndicator } from '@/hooks/use-currency-pricing';
import { useUserLocationWithCurrency } from '@/hooks/use-user-location-with-currency';
import { getAnnualSavingsText } from '@/config/pricing';
import { CurrencySelector } from '@/components/pricing/CurrencySelector';
import { useTranslation } from 'react-i18next';

const PricingSection = () => {
  const { t } = useTranslation();
  const { pricing, userCurrency, userCountry, isLoading, setPricingCurrency } = useCurrencyPricing();
  const { forceAustraliaDetection, clearLocationCache } = useUserLocationWithCurrency();
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('pricing.section_title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('pricing.section_subtitle')}
          </p>
          {userCountry && !isLoading && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <p className="text-sm text-muted-foreground">
                {t('pricing.prices_shown', { currency: userCurrency, country: userCountry })}
                {pricing.monthly.isConverted && <span className="ml-1">{t('pricing.converted_from_aud')}</span>}
              </p>
              <CurrencySelector
                currentCurrency={userCurrency}
                onCurrencyChange={setPricingCurrency}
                userCountry={userCountry}
                isConverted={pricing.monthly.isConverted}
              />
              {/* Debug buttons - only show if currency is wrong for Australia */}
              {userCountry !== 'Australia' && userCurrency !== 'AUD' && (
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={forceAustraliaDetection}
                    className="text-xs"
                  >
                    🇦🇺 Force AUD
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearLocationCache}
                    className="text-xs"
                  >
                    🗑️ Clear Cache
                  </Button>
                </div>
              )}
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center mt-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">{t('pricing.detecting_currency')}</span>
            </div>
          )}
        </div>

        <div className="mb-12 max-w-4xl mx-auto">
          <div className="bg-primary/5 rounded-lg p-8 border border-primary/20 flex items-center gap-6">
            <img src="/barry-avatar.png" alt="Barry AI Mechanic" className="h-32 w-32 rounded-full flex-shrink-0 object-cover" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{t('pricing.barry.title')}</h3>
              <p className="text-muted-foreground">
                {t('pricing.barry.description')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Monthly Plan */}
          <Card className="border-2 border-border">
            <CardHeader className="text-center pb-8 pt-6">
              <p className="text-2xl font-bold">{t('pricing.monthly.title')}</p>
              <h3 className="text-4xl font-bold mt-2">
                {formatPriceWithIndicator(pricing.monthly.amount, pricing.monthly.currency, pricing.monthly.isConverted)}
                <span className="text-lg font-normal text-muted-foreground">{t('pricing.monthly.period')}</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-2">{t('pricing.monthly.subtitle')}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>{t('pricing.features.community_access')}</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>{t('pricing.features.knowledge_base')}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/signup?plan=monthly">{t('pricing.monthly.cta')}</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Annual Plan */}
          <Card className="border-2 border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-bold">
              {t('pricing.annual.badge')}
            </div>
            <CardHeader className="text-center pb-8 pt-6">
              <p className="text-2xl font-bold">{t('pricing.annual.title')}</p>
              <h3 className="text-4xl font-bold mt-2">
                {formatPriceWithIndicator(pricing.annual.amount, pricing.annual.currency, pricing.annual.isConverted)}
                <span className="text-lg font-normal text-muted-foreground">{t('pricing.annual.period')}</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {getAnnualSavingsText(pricing.annual.currency, pricing.monthly.amount, pricing.annual.amount)}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>{t('pricing.features.community_access')}</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>{t('pricing.features.knowledge_base')}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/signup?plan=annual">{t('pricing.annual.cta')}</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Lifetime Plan */}
          <Card className="border-2 border-accent relative overflow-hidden">
            <div className="absolute top-0 left-0 bg-accent text-accent-foreground px-3 py-1 text-xs font-bold">
              {t('pricing.lifetime.badge')}
            </div>
            <CardHeader className="text-center pb-8 pt-6">
              <p className="text-2xl font-bold">{t('pricing.lifetime.title')}</p>
              <h3 className="text-4xl font-bold mt-2">
                {formatPriceWithIndicator(pricing.lifetime.amount, pricing.lifetime.currency, pricing.lifetime.isConverted)}
                <span className="text-lg font-normal text-muted-foreground">{t('pricing.lifetime.period')}</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {t('pricing.lifetime.subtitle')}
              </p>
              <p className="text-xs text-accent-foreground mt-1 font-medium">
                {t('pricing.lifetime.badge_info')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>{t('pricing.features.community_access')}</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>{t('pricing.features.knowledge_base')}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/signup?plan=lifetime">{t('pricing.lifetime.cta')}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
