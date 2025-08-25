
import { lazy } from "react";
import { AppRouteObject } from "./index";
import MarketplaceLayout from "@/pages/MarketplaceLayout";
import Marketplace from "@/pages/Marketplace";
import CreateListing from "@/pages/CreateListing";
import { lazyImportWithRetry } from "@/utils/lazyWithRetry";

// Use lazyImportWithRetry for safer lazy loading with automatic retry
const { ListingDetailPage } = lazyImportWithRetry(() => import("@/components/marketplace/ListingDetailPage"), "ListingDetailPage");
const { AccountSettings } = lazyImportWithRetry(() => import("@/components/marketplace/auth/AccountSettings"), "AccountSettings");
const { TwoFactorSetup } = lazyImportWithRetry(() => import("@/components/marketplace/auth/TwoFactorSetup"), "TwoFactorSetup");
const { VerifyEmail } = lazyImportWithRetry(() => import("@/components/marketplace/auth/VerifyEmail"), "VerifyEmail");

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
        path: "create-listing",
        element: <CreateListing />,
        requireAuth: true,
      },
      {
        path: "listing/:listingId",
        element: <ListingDetailPage />,
      },
      {
        path: "two-factor-setup",
        element: <TwoFactorSetup />,
        requireAuth: true,
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
        requireAuth: true,
      },
    ],
  },
];
