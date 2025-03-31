
import { ListingDetailPage } from '@/components/marketplace/ListingDetailPage';
import { ListingForm } from '@/components/marketplace/listing-form/ListingForm';
import MarketplaceLayout from '@/pages/MarketplaceLayout';
import { AppRouteObject } from './index';
import EmailVerificationCheck from '@/components/marketplace/auth/EmailVerificationCheck';

export const marketplaceRoutes: AppRouteObject[] = [
  {
    path: "/marketplace",
    element: <MarketplaceLayout />,
    requireAuth: true,
  },
  {
    path: "/marketplace/create",
    element: <EmailVerificationCheck><ListingForm /></EmailVerificationCheck>,
    requireAuth: true,
  },
  {
    path: "/marketplace/:id",
    element: <ListingDetailPage />,
    requireAuth: true,
  },
];
