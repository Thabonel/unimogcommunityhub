
import { useTranslation } from 'react-i18next';
import { MarketplaceListingsPage } from '@/components/marketplace/MarketplaceListingsPage';

const Marketplace = () => {
  const { t } = useTranslation('marketplace');

  return (
    <div className="container pb-8">
      <div className="military-card p-4 rounded-lg">
        <MarketplaceListingsPage />
      </div>
    </div>
  );
};

export default Marketplace;
