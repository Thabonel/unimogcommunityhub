import { lazy } from 'react';

// Lazy load all major pages for code splitting
// This reduces initial bundle size significantly

// Public pages
export const Index = lazy(() => import('@/pages/Index'));
export const About = lazy(() => import('@/pages/About'));
export const Contact = lazy(() => import('@/pages/Contact'));
export const Pricing = lazy(() => import('@/pages/Pricing'));
export const NotFound = lazy(() => import('@/pages/NotFound'));

// Auth pages
export const Login = lazy(() => import('@/pages/Login'));
export const Signup = lazy(() => import('@/pages/Signup'));
export const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
export const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
export const AuthCallback = lazy(() => import('@/pages/AuthCallback'));

// Protected pages (these load after auth)
export const Dashboard = lazy(() => import('@/pages/Dashboard'));
export const Community = lazy(() => import('@/pages/Community'));
export const Profile = lazy(() => import('@/pages/Profile'));
export const Settings = lazy(() => import('@/pages/Settings'));
export const Messages = lazy(() => import('@/pages/Messages'));
export const Search = lazy(() => import('@/pages/Search'));

// Knowledge pages
export const Knowledge = lazy(() => import('@/pages/Knowledge'));
export const KnowledgeManuals = lazy(() => import('@/pages/KnowledgeManuals'));

// Trips & Maps
export const Trips = lazy(() => import('@/pages/Trips'));
export const ExploreRoutes = lazy(() => import('@/pages/ExploreRoutes'));
export const ExploreMap = lazy(() => import('@/pages/ExploreMap'));
export const TravelPlanner = lazy(() => import('@/pages/TravelPlanner'));

// Marketplace
export const Marketplace = lazy(() => import('@/pages/Marketplace'));
export const CreateListing = lazy(() => import('@/pages/CreateListing'));
export const MyListings = lazy(() => import('@/pages/MyListings'));

// Vehicle pages
export const VehicleShowcase = lazy(() => import('@/pages/VehicleShowcase'));
export const VehicleDetail = lazy(() => import('@/pages/VehicleDetail'));
export const VehicleDashboard = lazy(() => import('@/pages/VehicleDashboard'));
export const UnimogU1700L = lazy(() => import('@/pages/UnimogU1700L'));

// Admin pages (only load for admins)
export const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
export const SystemDiagnostics = lazy(() => import('@/pages/SystemDiagnostics'));
export const TestSupabase = lazy(() => import('@/pages/TestSupabase'));
export const DebugEnv = lazy(() => import('@/pages/DebugEnv'));
export const TestLogging = lazy(() => import('@/pages/TestLogging'));

// QA/Debug pages  
export const SiteQALog = lazy(() => import('@/pages/SiteQALog'));
export const SiteQALogSupabase = lazy(() => import('@/pages/SiteQALogSupabase'));

// WIS System pages
export const WISSystemPage = lazy(() => import('@/pages/knowledge/WISSystemPage'));
export const WISEPCPage = lazy(() => import('@/pages/knowledge/WISEPCPage'));

// Other pages
export const Resources = lazy(() => import('@/pages/Resources'));
export const Privacy = lazy(() => import('@/pages/Privacy'));
export const Terms = lazy(() => import('@/pages/Terms'));
export const Cookies = lazy(() => import('@/pages/Cookies'));