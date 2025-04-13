
import { AppRouteObject } from './index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ResetPassword from '@/pages/ResetPassword';
import AuthCallback from '@/pages/AuthCallback';
import SubscriptionSuccess from '@/pages/SubscriptionSuccess';
import SubscriptionCanceled from '@/pages/SubscriptionCanceled';

export const publicRoutes: AppRouteObject[] = [
  {
    path: '/login',
    element: <Login />,
    requireAuth: false,
  },
  {
    path: '/signup',
    element: <Signup />,
    requireAuth: false,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
    requireAuth: false,
  },
  {
    path: '/auth-callback',
    element: <AuthCallback />,
    requireAuth: false,
  },
  {
    path: '/subscription/success',
    element: <SubscriptionSuccess />,
    requireAuth: true,
  },
  {
    path: '/subscription/canceled',
    element: <SubscriptionCanceled />,
    requireAuth: true,
  },
];

export default publicRoutes;
