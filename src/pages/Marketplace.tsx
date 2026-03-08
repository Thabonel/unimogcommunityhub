
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MarketplaceListingsPage } from '@/components/marketplace/MarketplaceListingsPage';
import { useBarry } from '@/contexts/BarryContext';

const Marketplace = () => {
  const { t } = useTranslation('marketplace');
  const { setPageContext, clearPageContext } = useBarry();

  useEffect(() => {
    setPageContext({ pageName: 'marketplace', pageTitle: 'Marketplace' });
    return () => clearPageContext();
  }, [setPageContext, clearPageContext]);

  return (
    <div className="container pb-8">
      <div className="military-card p-4 rounded-lg">
        <MarketplaceListingsPage />
      </div>
    </div>
  );
};

export default Marketplace;
