
import { lazy } from "react";
import { AppRouteObject } from "./index";
import MarketplaceLayout from "@/pages/MarketplaceLayout";
import Marketplace from "@/pages/Marketplace";
import CreateListing from "@/pages/CreateListing";
import { lazyImport } from "@/utils/lazyImport";

// Use lazyImport helper for named exports
const { ListingDetailPage } = lazyImport(() => import("@/components/marketplace/ListingDetailPage"), "ListingDetailPage");
const { AccountSettings } = lazyImport(() => import("@/components/marketplace/auth/AccountSettings"), "AccountSettings");
const { TwoFactorSetup } = lazyImport(() => import("@/components/marketplace/auth/TwoFactorSetup"), "TwoFactorSetup");
const { VerifyEmail } = lazyImport(() => import("@/components/marketplace/auth/VerifyEmail"), "VerifyEmail");

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
        path: "account-settings",
        element: <AccountSettings />,
        requireAuth: true,
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
