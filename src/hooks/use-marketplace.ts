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

// Helper function to fetch seller profile information
async function fetchSellerProfile(sellerId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, display_name, avatar_url, created_at, location')
      .eq('id', sellerId)
      .single();
    
    if (error) {
      console.warn(`Could not fetch profile for seller ${sellerId}:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Error fetching seller profile:', error);
    return null;
  }
}

// Helper function to format time ago (like Facebook)
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo`;
  return `${Math.floor(seconds / 31536000)}y`;
}

export const useMarketplaceListings = (filters: ListingFilters = {}) => {
  return useQuery({
    queryKey: ['marketplaceListings', filters],
    queryFn: async () => {
      try {
        // Fetch listings from database
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

        const { data: listings, error } = await query;
        
        if (error) {
          console.error('Error fetching listings from database:', error);
          throw error;
        }

        if (!listings || listings.length === 0) {
          return [];
        }

        // Fetch all unique seller IDs
        const sellerIds = [...new Set(listings.map(l => l.seller_id))];
        
        // Batch fetch all seller profiles
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, display_name, avatar_url, created_at, location')
          .in('id', sellerIds);
        
        if (profileError) {
          console.warn('Could not fetch seller profiles:', profileError);
        }
        
        // Create a map of seller profiles for quick lookup
        const profileMap = new Map();
        if (profiles) {
          profiles.forEach(profile => {
            profileMap.set(profile.id, profile);
          });
        }

        // Transform listings with seller information
        return listings.map(listing => {
          const sellerProfile = profileMap.get(listing.seller_id);
          
          return {
            id: listing.id,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            currency: listing.currency || 'USD', // Include currency field
            category: listing.category,
            condition: listing.condition,
            photos: listing.images || [],
            sellerId: listing.seller_id,
            sellerName: sellerProfile?.display_name || sellerProfile?.full_name || 'Unimog Owner',
            sellerAvatar: sellerProfile?.avatar_url || '',
            createdAt: listing.created_at,
            location: listing.location || sellerProfile?.location || 'Unknown Location',
            timeAgo: formatTimeAgo(listing.created_at),
            viewCount: listing.view_count || 0,
            savedCount: listing.saved_count || 0,
            memberSince: sellerProfile?.created_at ? new Date(sellerProfile.created_at).getFullYear() : null,
          } as MarketplaceListing & { 
            timeAgo: string; 
            viewCount: number; 
            savedCount: number; 
            memberSince: number | null;
          };
        });
      } catch (error) {
        console.error('Error in marketplace listings:', error);
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
      
      // Fetch the listing
      const { data: listing, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('id', listingId)
        .single();
      
      if (error) {
        console.error('Error fetching listing detail:', error);
        throw error;
      }
      
      if (!listing) throw new Error('Listing not found');
      
      // Fetch seller profile
      const sellerProfile = await fetchSellerProfile(listing.seller_id);
      
      // Increment view count (non-blocking)
      supabase
        .from('marketplace_listings')
        .update({ view_count: (listing.view_count || 0) + 1 })
        .eq('id', listingId)
        .then(() => {
          console.log('View count updated');
        })
        .catch(err => {
          console.warn('Could not update view count:', err);
        });
      
      // Transform to match expected format with enhanced seller info
      return {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        condition: listing.condition,
        photos: listing.images || [],
        sellerId: listing.seller_id,
        sellerName: sellerProfile?.display_name || sellerProfile?.full_name || 'Unimog Owner',
        sellerAvatar: sellerProfile?.avatar_url || '',
        createdAt: listing.created_at,
        location: listing.location || sellerProfile?.location || 'Unknown Location',
        timeAgo: formatTimeAgo(listing.created_at),
        viewCount: listing.view_count || 0,
        savedCount: listing.saved_count || 0,
        memberSince: sellerProfile?.created_at ? new Date(sellerProfile.created_at).getFullYear() : null,
        sellerLocation: sellerProfile?.location,
      } as MarketplaceListing & { 
        timeAgo: string; 
        viewCount: number; 
        savedCount: number; 
        memberSince: number | null;
        sellerLocation?: string;
      };
    },
    enabled: !!listingId,
  });
};

export const useSearchFilters = () => {
  const [filters, setFilters] = useState<ListingFilters>({});
  
  const updateFilters = (newFilters: Partial<ListingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const clearFilters = () => {
    setFilters({});
  };
  
  return { filters, updateFilters, clearFilters };
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: CreateListingData) => {
      if (!user) {
        throw new Error('You must be logged in to create a listing');
      }

      // Upload photos first
      const photoUrls: string[] = [];
      
      for (const photo of data.photos) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('marketplace')
          .upload(fileName, photo, {
            cacheControl: '3600',
            upsert: false,
          });
        
        if (uploadError) {
          console.error('Error uploading photo:', uploadError);
          throw new Error('Failed to upload photos');
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('marketplace')
          .getPublicUrl(fileName);
        
        photoUrls.push(publicUrl);
      }
      
      // Create the listing
      const { data: listing, error } = await supabase
        .from('marketplace_listings')
        .insert({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          condition: data.condition,
          location: data.location,
          images: photoUrls,
          seller_id: user.id,
          status: 'active',
          view_count: 0,
          saved_count: 0,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating listing:', error);
        throw new Error('Failed to create listing');
      }
      
      // Send notification email
      try {
        await sendListingCreatedNotification({
          sellerEmail: user.email || '',
          sellerName: user.user_metadata?.full_name || 'User',
          listingTitle: data.title,
          listingPrice: data.price,
          listingId: listing.id,
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't throw - email failure shouldn't break the listing creation
      }
      
      return listing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplaceListings'] });
      toast.success('Listing created successfully!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create listing');
    },
  });
};

// Hook for saving/unsaving listings
export const useSaveListing = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ listingId, save }: { listingId: string; save: boolean }) => {
      if (!user) throw new Error('You must be logged in to save listings');
      
      if (save) {
        // Save the listing
        const { error } = await supabase
          .from('saved_listings')
          .insert({
            user_id: user.id,
            listing_id: listingId,
          });
        
        if (error && error.code !== '23505') { // Ignore duplicate key errors
          throw error;
        }
        
        // Increment saved count
        await supabase.rpc('increment_saved_count', { listing_id: listingId });
      } else {
        // Unsave the listing
        const { error } = await supabase
          .from('saved_listings')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);
        
        if (error) throw error;
        
        // Decrement saved count
        await supabase.rpc('decrement_saved_count', { listing_id: listingId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplaceListings'] });
      queryClient.invalidateQueries({ queryKey: ['savedListings'] });
    },
  });
};

// Hook for getting user's saved listings
export const useSavedListings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['savedListings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('saved_listings')
        .select('listing_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return data?.map(item => item.listing_id) || [];
    },
    enabled: !!user,
  });
};