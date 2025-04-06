
import { lazy } from "react";
import { AppRouteObject } from "./index";
import MarketplaceLayout from "@/pages/MarketplaceLayout";
import Marketplace from "@/pages/Marketplace";

const LazyListingDetail = lazy(() => import("@/components/marketplace/ListingDetailPage"));
const LazyAccountSettings = lazy(() => import("@/components/marketplace/auth/AccountSettings"));
const LazyTwoFactorSetup = lazy(() => import("@/components/marketplace/auth/TwoFactorSetup"));
const LazyEmailVerification = lazy(() => import("@/components/marketplace/auth/VerifyEmail"));

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
