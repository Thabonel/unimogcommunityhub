
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MarketplaceListing, ListingCondition, CreateListingData } from '@/types/marketplace';
import { supabase } from '@/lib/supabase-client';
import { sendListingCreatedNotification } from '@/utils/emailUtils';
import { useAuth } from '@/contexts/AuthContext';

export interface ListingFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ListingCondition;
  searchTerm?: string;
}

export const useMarketplaceListings = (filters: ListingFilters = {}) => {
  return useQuery({
    queryKey: ['marketplaceListings', filters],
    queryFn: async () => {
      try {
        // First get the listings
        let query = supabase
          .from('marketplace_listings')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        // Apply filters
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.condition) {
          query = query.eq('condition', filters.condition);
        }
        if (filters.minPrice) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice) {
          query = query.lte('price', filters.maxPrice);
        }
        if (filters.searchTerm) {
          query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching listings from database:', error);
          throw error;
        }

        // Transform database data to match expected format
        // For now, we'll use placeholder seller info since the profile join isn't working
        return (data || []).map(listing => ({
          id: listing.id,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          category: listing.category,
          condition: listing.condition,
          photos: listing.images || [],
          sellerId: listing.seller_id,
          sellerName: 'Unimog Owner', // Placeholder until we fix the profile relationship
          sellerAvatar: '', // Placeholder
          createdAt: listing.created_at,
          location: listing.location,
        }));
      } catch (error) {
        console.error('Error fetching marketplace listings:', error);
        throw error;
      }
    },
  });
};

export const useListingDetail = (listingId: string | undefined) => {
  return useQuery({
    queryKey: ['marketplaceListing', listingId],
    queryFn: async () => {
      if (!listingId) return null;
      
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('id', listingId)
        .single();
      
      if (error) {
        console.error('Error fetching listing detail:', error);
        throw error;
      }
      
      if (!data) throw new Error('Listing not found');
      
      // Transform to match expected format
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        condition: data.condition,
        photos: data.images || [],
        sellerId: data.seller_id,
        sellerName: 'Unimog Owner', // Placeholder until we fix the profile relationship
        sellerAvatar: '', // Placeholder
        createdAt: data.created_at,
        location: data.location,
      } as MarketplaceListing;
    },
    enabled: !!listingId,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: CreateListingData) => {
      // This will be replaced with a Supabase implementation later
      // For now, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Creating listing with data:', data);
      
      // Generate a mock ID
      const listingId = Math.random().toString(36).substring(2);
      
      // Return a mock response
      const newListing = {
        id: listingId,
        ...data,
        photos: ['/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png'], // Mock photo URLs
        sellerId: user?.id || 'current-user-id',
        sellerName: user?.user_metadata?.full_name || 'Current User',
        sellerAvatar: user?.user_metadata?.avatar_url || '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
        createdAt: new Date().toISOString(),
      };
      
      // Send notification email if we have user email
      if (user?.email) {
        await sendListingCreatedNotification(
          user.email,
          data.title,
          listingId
        );
      }
      
      return newListing;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['marketplaceListings'] });
      toast.success('Listing created successfully');
    },
    onError: (error) => {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing');
    },
  });
};

export const useSearchFilters = () => {
  const [filters, setFilters] = useState<ListingFilters>({});
  
  const updateFilters = (newFilters: Partial<ListingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const resetFilters = () => {
    setFilters({});
  };
  
  return {
    filters,
    updateFilters,
    resetFilters,
  };
};
