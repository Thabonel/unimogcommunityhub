
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Index from '../pages/Index';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import Cookies from '../pages/Cookies';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import AuthCallback from '../pages/AuthCallback';
// Add the ExploreMap import
import ExploreMap from '../pages/ExploreMap';

// Lazy loaded routes for public areas
const Pricing = lazy(() => import('../pages/Pricing'));
const Feedback = lazy(() => import('../pages/Feedback'));

// Learn About Unimogs page (public)
const LearnAboutUnimogs = lazy(() => import('../pages/learn/LearnAboutUnimogs'));

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/pricing',
    element: <Pricing />,
  },
  {
    path: '/terms',
    element: <Terms />,
  },
  {
    path: '/privacy',
    element: <Privacy />,
  },
  {
    path: '/cookies',
    element: <Cookies />,
  },
  {
    path: '/feedback',
    element: <Feedback />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/learn',
    element: <LearnAboutUnimogs />,
  },
  // Add the new ExploreMap route
  {
    path: '/explore',
    element: <ExploreMap />,
  },
];
