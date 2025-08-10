
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MarketplaceListing, ListingCondition, CreateListingData } from '@/types/marketplace';
import { supabase } from '@/lib/supabase-client';
import { sendListingCreatedNotification } from '@/utils/emailUtils';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for now - will be replaced with real Supabase queries later
const mockListings: MarketplaceListing[] = [
  {
    id: '1',
    title: 'Original Unimog U1700L Front Bumper',
    description: 'Excellent condition front bumper removed from my 1985 U1700L during restoration. Some minor scratches but no dents or rust.',
    price: 550,
    category: 'parts',
    condition: 'Good',
    photos: ['/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png'],
    sellerId: 'user1',
    sellerName: 'John Doe',
    sellerAvatar: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    createdAt: new Date().toISOString(),
    location: 'Munich, Germany',
  },
  {
    id: '2',
    title: 'Complete Set of 4 BF Goodrich Tires for Unimog',
    description: 'Four 335/80 R20 BF Goodrich tires with 80% tread remaining. Perfect for off-road adventures with your Unimog.',
    price: 1200,
    category: 'parts',
    condition: 'Like New',
    photos: ['/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png'],
    sellerId: 'user2',
    sellerName: 'Jane Smith',
    sellerAvatar: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    createdAt: new Date().toISOString(),
    location: 'Berlin, Germany',
  },
  {
    id: '3',
    title: '1982 Unimog U1700L - Fully Restored',
    description: 'Completely restored 1982 Mercedes-Benz Unimog U1700L. New engine, transmission rebuilt, new paint, and all systems operational. Must see to appreciate!',
    price: 65000,
    category: 'vehicles',
    condition: 'Good',
    photos: ['/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png'],
    sellerId: 'user3',
    sellerName: 'Michael Johnson',
    sellerAvatar: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    createdAt: new Date().toISOString(),
    location: 'Stuttgart, Germany',
  },
  {
    id: '4',
    title: 'Unimog Workshop Manual Collection',
    description: 'Complete set of factory workshop manuals for U1700L series. Includes engine, chassis, electrical, and hydraulic systems.',
    price: 250,
    category: 'accessories',
    condition: 'Fair',
    photos: ['/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png'],
    sellerId: 'user4',
    sellerName: 'Robert Williams',
    sellerAvatar: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    createdAt: new Date().toISOString(),
    location: 'Hamburg, Germany',
  },
];

export interface ListingFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ListingCondition;
  searchTerm?: string;
}

// Mock function to filter listings
const filterListings = (listings: MarketplaceListing[], filters: ListingFilters): MarketplaceListing[] => {
  return listings.filter(listing => {
    if (filters.category && listing.category !== filters.category) return false;
    if (filters.minPrice && listing.price < filters.minPrice) return false;
    if (filters.maxPrice && listing.price > filters.maxPrice) return false;
    if (filters.condition && listing.condition !== filters.condition) return false;
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      return (
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.description.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });
};

export const useMarketplaceListings = (filters: ListingFilters = {}) => {
  return useQuery({
    queryKey: ['marketplaceListings', filters],
    queryFn: async () => {
      let query = supabase
        .from('marketplace_listings')
        .select(`
          *,
          profiles:seller_id (
            full_name,
            display_name,
            avatar_url
          )
        `)
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
        console.error('Error fetching listings:', error);
        throw error;
      }

      // Transform data to match expected format
      return (data || []).map(listing => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        condition: listing.condition,
        photos: listing.images || [],
        sellerId: listing.seller_id,
        sellerName: listing.profiles?.display_name || listing.profiles?.full_name || 'Anonymous',
        sellerAvatar: listing.profiles?.avatar_url || '',
        createdAt: listing.created_at,
        location: listing.location,
      }));
    },
  });
};

export const useListingDetail = (listingId: string | undefined) => {
  return useQuery({
    queryKey: ['marketplaceListing', listingId],
    queryFn: async () => {
      if (!listingId) return null;
      // This will be replaced with a Supabase query later
      const listing = mockListings.find(l => l.id === listingId);
      if (!listing) throw new Error('Listing not found');
      return listing;
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
