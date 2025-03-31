
import { ListingDetailPage } from '@/components/marketplace/ListingDetailPage';
import { ListingForm } from '@/components/marketplace/listing-form/ListingForm';
import MarketplaceLayout from '@/pages/MarketplaceLayout';
import { AppRouteObject } from './index';

export const marketplaceRoutes: AppRouteObject[] = [
  {
    path: "/marketplace",
    element: <MarketplaceLayout />,
    requireAuth: true,
  },
  {
    path: "/marketplace/create",
    element: <ListingForm />,
    requireAuth: true,
  },
  {
    path: "/marketplace/:id",
    element: <ListingDetailPage />,
    requireAuth: true,
  },
];
