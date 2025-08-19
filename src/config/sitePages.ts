// Complete list of all pages in the application for QA tracking
export interface PageOption {
  value: string;
  label: string;
  category: string;
}

export const sitePages: PageOption[] = [
  // Main Pages
  { value: '/', label: 'Home', category: 'Main Pages' },
  { value: '/about', label: 'About', category: 'Main Pages' },
  { value: '/contact', label: 'Contact', category: 'Main Pages' },
  { value: '/pricing', label: 'Pricing', category: 'Main Pages' },
  { value: '/trips', label: 'Trips', category: 'Main Pages' },
  { value: '/explore-routes', label: 'Explore Routes', category: 'Main Pages' },
  { value: '/explore-map', label: 'Explore Map', category: 'Main Pages' },
  
  // Knowledge Section
  { value: '/knowledge', label: 'Knowledge Hub', category: 'Knowledge' },
  { value: '/knowledge/manuals', label: 'Manuals', category: 'Knowledge' },
  { value: '/knowledge/repair', label: 'Repair Guides', category: 'Knowledge' },
  { value: '/knowledge/maintenance', label: 'Maintenance', category: 'Knowledge' },
  { value: '/knowledge/modifications', label: 'Modifications', category: 'Knowledge' },
  { value: '/knowledge/tyres', label: 'Tyres Guide', category: 'Knowledge' },
  { value: '/knowledge/adventures', label: 'Adventures', category: 'Knowledge' },
  { value: '/knowledge/ai-mechanic', label: 'AI Mechanic (Barry)', category: 'Knowledge' },
  { value: '/knowledge/safety', label: 'Safety', category: 'Knowledge' },
  
  // User Account
  { value: '/dashboard', label: 'Dashboard', category: 'User Account' },
  { value: '/profile', label: 'Profile', category: 'User Account' },
  { value: '/profile/setup', label: 'Profile Setup', category: 'User Account' },
  { value: '/vehicle-dashboard', label: 'Vehicle Dashboard', category: 'User Account' },
  { value: '/messages', label: 'Messages', category: 'User Account' },
  { value: '/community', label: 'Community', category: 'User Account' },
  { value: '/community/improvement', label: 'Community Improvement', category: 'User Account' },
  { value: '/resources', label: 'Resources', category: 'User Account' },
  { value: '/settings', label: 'Settings', category: 'User Account' },
  { value: '/my-listings', label: 'My Listings', category: 'User Account' },
  
  // Marketplace
  { value: '/marketplace', label: 'Marketplace', category: 'Marketplace' },
  { value: '/marketplace/create-listing', label: 'Create Listing', category: 'Marketplace' },
  { value: '/marketplace/account-settings', label: 'Account Settings', category: 'Marketplace' },
  { value: '/marketplace/two-factor-setup', label: 'Two-Factor Setup', category: 'Marketplace' },
  { value: '/marketplace/verify-email', label: 'Verify Email', category: 'Marketplace' },
  
  // Auth Pages
  { value: '/login', label: 'Login', category: 'Authentication' },
  { value: '/signup', label: 'Sign Up', category: 'Authentication' },
  { value: '/reset-password', label: 'Reset Password', category: 'Authentication' },
  { value: '/auth-callback', label: 'Auth Callback', category: 'Authentication' },
  { value: '/subscription/success', label: 'Subscription Success', category: 'Authentication' },
  { value: '/subscription/canceled', label: 'Subscription Canceled', category: 'Authentication' },
  
  // Admin Section
  { value: '/admin', label: 'Admin Dashboard', category: 'Admin' },
  { value: '/admin/test-supabase', label: 'Test Supabase', category: 'Admin' },
  { value: '/admin/debug-env', label: 'Debug Environment', category: 'Admin' },
  { value: '/admin/test-logging', label: 'Test Logging', category: 'Admin' },
  { value: '/admin/manual-processing', label: 'Manual Processing', category: 'Admin' },
  { value: '/admin/setup', label: 'Admin Setup', category: 'Admin' },
  { value: '/diagnostics', label: 'System Diagnostics', category: 'Admin' },
  
  // Other Pages
  { value: '/test-chatgpt', label: 'Test ChatGPT', category: 'Other' },
  { value: '/unimog-u1700l', label: 'Unimog U1700L', category: 'Other' },
  { value: '/qa', label: 'QA Tracking', category: 'Other' },
  { value: '/qa-local', label: 'QA Tracking (Local)', category: 'Other' },
];

// Group pages by category for easier rendering
export const groupedPages = sitePages.reduce((acc, page) => {
  if (!acc[page.category]) {
    acc[page.category] = [];
  }
  acc[page.category].push(page);
  return acc;
}, {} as Record<string, PageOption[]>);