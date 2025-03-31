
import { ListingDetailPage } from '@/components/marketplace/ListingDetailPage';
import { ListingForm } from '@/components/marketplace/listing-form/ListingForm';
import MarketplaceLayout from '@/pages/MarketplaceLayout';
import { AppRouteObject } from './index';
import EmailVerificationCheck from '@/components/marketplace/auth/EmailVerificationCheck';
import { VerifyEmail } from '@/components/marketplace/auth/VerifyEmail';
import { AccountSettings } from '@/components/marketplace/auth/AccountSettings';
import { TwoFactorSetup } from '@/components/marketplace/auth/TwoFactorSetup';

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
  {
    path: "/marketplace/verify-email",
    element: <VerifyEmail />,
    requireAuth: true,
  },
  {
    path: "/marketplace/account-settings",
    element: <AccountSettings />,
    requireAuth: true,
  },
  {
    path: "/marketplace/two-factor-setup",
    element: <TwoFactorSetup />,
    requireAuth: true,
  },
];
