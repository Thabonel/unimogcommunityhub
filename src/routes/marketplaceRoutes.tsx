
import { lazy } from "react";
import { AppRouteObject } from "./index";
import MarketplaceLayout from "@/pages/MarketplaceLayout";
import Marketplace from "@/pages/Marketplace";

// Fix lazy imports to ensure they return the expected type
const LazyListingDetail = lazy(() => import("@/components/marketplace/ListingDetailPage").then(module => ({ default: module as any })));
const LazyAccountSettings = lazy(() => import("@/components/marketplace/auth/AccountSettings").then(module => ({ default: module as any })));
const LazyTwoFactorSetup = lazy(() => import("@/components/marketplace/auth/TwoFactorSetup").then(module => ({ default: module as any })));
const LazyEmailVerification = lazy(() => import("@/components/marketplace/auth/VerifyEmail").then(module => ({ default: module as any })));

export const marketplaceRoutes: AppRouteObject[] = [
  {
    path: "/marketplace",
    element: <MarketplaceLayout />,
    children: [
      {
        path: "",
        element: <Marketplace />,
      },
      {
        path: "listing/:listingId",
        element: <LazyListingDetail />,
      },
      {
        path: "account-settings",
        element: <LazyAccountSettings />,
        requireAuth: true,
      },
      {
        path: "two-factor-setup",
        element: <LazyTwoFactorSetup />,
        requireAuth: true,
      },
      {
        path: "verify-email",
        element: <LazyEmailVerification />,
        requireAuth: true,
      },
    ],
  },
];
