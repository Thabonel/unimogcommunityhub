
import { lazy } from "react";
import { AppRouteObject } from "./index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import AuthCallback from "@/pages/AuthCallback";
import Feedback from "@/pages/Feedback";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Pricing from "@/pages/Pricing";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Cookies from "@/pages/Cookies";

const LazyLearnAboutUnimogs = lazy(() => import("@/pages/learn/LearnAboutUnimogs"));
const LazyUnimogU1700L = lazy(() => import("@/pages/UnimogU1700L"));

export const publicRoutes: AppRouteObject[] = [
  // Authentication routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  
  // Public pages
  {
    path: "/feedback",
    element: <Feedback />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/cookies",
    element: <Cookies />,
  },
  
  // Unimog information pages
  {
    path: "/learn",
    element: <LazyLearnAboutUnimogs />,
  },
  {
    path: "/unimog/u1700l",
    element: <LazyUnimogU1700L />,
  },
];
