import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import { getCurrencySymbol, formatCurrency } from '@/utils/currencyUtils';
import { UserProfile } from '@/types/user';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: string; // Currency the item was listed in
  category: string;
  condition: string;
  status: 'active' | 'sold' | 'draft';
  images: string[];
  created_at: string;
  updated_at: string;
}

const MyListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState<string>('USD');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchMyListings();
    fetchUserCurrency();
  }, [user]);

  const fetchMyListings = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match the expected format
      const transformedListings = (data || []).map(listing => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        currency: listing.currency || 'USD',
        category: listing.category,
        condition: listing.condition,
        status: listing.status as 'active' | 'sold' | 'draft',
        images: listing.images || [],
        created_at: listing.created_at,
        updated_at: listing.updated_at,
      }));

      setListings(transformedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error",
        description: "Failed to load your listings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserCurrency = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('currency')
        .eq('id', user.id)
        .single();
      
      if (!error && data?.currency) {
        setUserCurrency(data.currency);
      }
    } catch (error) {
      console.error('Error fetching user currency:', error);
    }
  };

  const deleteListing = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('marketplace_listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      setListings(listings.filter(listing => listing.id !== listingId));
      toast({
        title: "Listing deleted",
        description: "Your listing has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: "Error",
        description: "Failed to delete listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateListingStatus = async (listingId: string, status: 'active' | 'sold' | 'draft') => {
    try {
      const { error } = await supabase
        .from('marketplace_listings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', listingId);

      if (error) throw error;

      setListings(listings.map(listing => 
        listing.id === listingId ? { ...listing, status } : listing
      ));
      
      toast({
        title: "Status updated",
        description: `Listing marked as ${status}.`,
      });
    } catch (error) {
      console.error('Error updating listing status:', error);
      toast({
        title: "Error",
        description: "Failed to update listing status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'sold':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (!user) {
    return (
      <Layout isLoggedIn={false}>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please log in to view your listings</h1>
            <Link to="/auth/login">
              <Button>Log In</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const userData = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    avatarUrl: user?.user_metadata?.avatar_url || '',
  };

  return (
    <Layout isLoggedIn={true} user={userData}>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200">
            My Listings
          </h1>
          <Link to="/marketplace/create-listing">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Listing
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No listings yet</h2>
            <p className="text-muted-foreground mb-4">
              Start selling your Unimog parts and accessories
            </p>
            <Link to="/marketplace/create-listing">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Listing
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id}>
                {listing.images && listing.images.length > 0 && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{listing.title}</CardTitle>
                    <Badge variant={getStatusBadgeVariant(listing.status)}>
                      {listing.status}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-unimog-600">
                    {getCurrencySymbol(listing.currency || userCurrency)}{listing.price.toLocaleString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="outline">{listing.category}</Badge>
                    <Badge variant="outline">{listing.condition}</Badge>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link to={`/marketplace/listing/${listing.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link to={`/marketplace/edit-listing/${listing.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    {listing.status !== 'sold' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateListingStatus(listing.id, 'sold')}
                      >
                        Mark as Sold
                      </Button>
                    )}
                    {listing.status === 'sold' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateListingStatus(listing.id, 'active')}
                      >
                        Reactivate
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this listing?')) {
                          deleteListing(listing.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyListings;