import Layout from '@/components/Layout';
import { GearList } from '@/components/shop/GearList';
import { gearCatalog } from '@/data/gearCatalog';

const Shop = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Recommended Gear</h1>
            <p className="text-muted-foreground text-lg">
              Curated gear and accessories for Unimog owners and adventurers
            </p>
            <p className="text-sm text-muted-foreground">
              Supporting links help keep this community running
            </p>
          </div>

          <GearList items={gearCatalog} />
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
