
import { useState, useCallback } from "react";

type UserFilter = 'status' | 'subscription' | 'role';
type FilterValue = string | null;

export interface UserWithSubscription {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  is_admin?: boolean;
  subscription?: {
    level: string;
    is_active: boolean;
    is_trial: boolean;
    expires_at: string | null;
  }
}

export interface FilterOption {
  key: string;
  label: string;
  options: {
    value: string;
    label: string;
  }[];
}

export function useUsersFilters() {
  const [filters, setFilters] = useState<Record<string, FilterValue>>({});
  
  // Filter options for the UI
  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'banned', label: 'Banned' }
      ]
    },
    {
      key: 'subscription',
      label: 'Subscription',
      options: [
        { value: 'free', label: 'Free' },
        { value: 'trial', label: 'Trial' },
        { value: 'basic', label: 'Basic' },
        { value: 'premium', label: 'Premium' },
        { value: 'expired', label: 'Expired' }
      ]
    },
    {
      key: 'role',
      label: 'Role',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' }
      ]
    }
  ];
  
  // Apply filters to the users list
  const applyFilters = useCallback((newFilters: Record<string, FilterValue>) => {
    setFilters(newFilters);
  }, []);
  
  // Filter users based on selected filters
  const filterUsers = useCallback((users: UserWithSubscription[]): UserWithSubscription[] => {
    if (!filters || Object.keys(filters).length === 0) {
      return users;
    }
    
    return users.filter(user => {
      // Status filter
      if (filters.status) {
        if (filters.status === 'active' && user.banned_until) {
          return false;
        }
        if (filters.status === 'banned' && !user.banned_until) {
          return false;
        }
      }
      
      // Subscription filter
      if (filters.subscription) {
        if (!user.subscription && filters.subscription !== 'free') {
          return false;
        }
        
        if (user.subscription) {
          if (filters.subscription === 'free') {
            return false;
          }
          
          if (filters.subscription === 'trial' && !user.subscription.is_trial) {
            return false;
          }
          
          if (filters.subscription === 'expired' && 
              (user.subscription.is_active || !user.subscription.expires_at)) {
            return false;
          }
          
          if (['basic', 'premium'].includes(filters.subscription) && 
              user.subscription.level !== filters.subscription) {
            return false;
          }
        }
      }
      
      // Role filter
      if (filters.role) {
        if (filters.role === 'admin' && !user.is_admin) {
          return false;
        }
        if (filters.role === 'user' && user.is_admin) {
          return false;
        }
      }
      
      return true;
    });
  }, [filters]);
  
  return {
    filters,
    filterOptions,
    applyFilters,
    filterUsers
  };
}
