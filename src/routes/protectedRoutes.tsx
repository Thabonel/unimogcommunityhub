
import Dashboard from "@/pages/Dashboard";
import UnimogU1700L from "@/pages/UnimogU1700L";
import ProfileSetup from "@/pages/ProfileSetup";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Marketplace from "@/pages/Marketplace";
import Trips from "@/pages/Trips";
import Community from "@/pages/Community";
import Messages from "@/pages/Messages";
import Search from "@/pages/Search";
import Feedback from "@/pages/Feedback";
import CommunityImprovement from "@/pages/CommunityImprovement";
import VehicleDashboard from "@/pages/VehicleDashboard"; // Add the new page
import { AppRouteObject } from "./index";

export const protectedRoutes: AppRouteObject[] = [
  {
    path: "/profile-setup",
    element: <ProfileSetup />,
    requireAuth: true,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    requireAuth: true,
  },
  {
    path: "/unimog-u1700l",
    element: <UnimogU1700L />,
    requireAuth: true,
  },
  {
    path: "/profile",
    element: <Profile />,
    requireAuth: true,
  },
  {
    path: "/profile/:id",
    element: <Profile />,
    requireAuth: true,
  },
  {
    path: "/settings",
    element: <Settings />,
    requireAuth: true,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
    requireAuth: true,
  },
  {
    path: "/trips",
    element: <Trips />,
    requireAuth: true,
  },
  {
    path: "/community",
    element: <Community />,
    requireAuth: true,
  },
  {
    path: "/community/improvement",
    element: <CommunityImprovement />,
    requireAuth: true,
  },
  {
    path: "/messages",
    element: <Messages />,
    requireAuth: true,
  },
  {
    path: "/search",
    element: <Search />,
    requireAuth: true,
  },
  {
    path: "/feedback",
    element: <Feedback />,
    requireAuth: true,
  },
  {
    path: "/vehicle-dashboard",
    element: <VehicleDashboard />,
    requireAuth: true,
  },
];
