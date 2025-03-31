
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import About from "@/pages/About";
import Pricing from "@/pages/Pricing";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Cookies from "@/pages/Cookies";
import Careers from "@/pages/Careers";
import AuthCallback from "@/pages/AuthCallback";
import NotFound from "@/pages/NotFound";
import { AppRouteObject } from "./index";

// Import the new page location
import LearnAboutUnimogs from "@/pages/learn/LearnAboutUnimogs";

export const publicRoutes: AppRouteObject[] = [
  {
    path: "/",
    element: <Index />,
    requireAuth: false,
  },
  {
    path: "/login",
    element: <Login />,
    requireAuth: false,
  },
  {
    path: "/signup",
    element: <Signup />,
    requireAuth: false,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    requireAuth: false,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
    requireAuth: false,
  },
  {
    path: "/about",
    element: <About />,
    requireAuth: false,
  },
  {
    path: "/learn-about-unimogs",
    element: <LearnAboutUnimogs />,
    requireAuth: true, // This page now requires auth
  },
  {
    path: "/pricing",
    element: <Pricing />,
    requireAuth: false,
  },
  {
    path: "/contact",
    element: <Contact />,
    requireAuth: false,
  },
  {
    path: "/terms",
    element: <Terms />,
    requireAuth: false,
  },
  {
    path: "/privacy",
    element: <Privacy />,
    requireAuth: false,
  },
  {
    path: "/cookies",
    element: <Cookies />,
    requireAuth: false,
  },
  {
    path: "/careers",
    element: <Careers />,
    requireAuth: false,
  },
  {
    path: "/auth-callback",
    element: <AuthCallback />,
    requireAuth: false,
  },
  {
    path: "*",
    element: <NotFound />,
    requireAuth: false,
  },
];
