import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, CheckCircle2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Vendor {
  id: string;
  slug: string;
  business_name: string;
  tagline: string;
  logo_url: string | null;
  is_verified: boolean;
  specialties: string[];
}

export function FeaturedVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadFeaturedVendors();
  }, []);

  const loadFeaturedVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, slug, business_name, tagline, logo_url, is_verified, specialties')
        .eq('is_featured', true)
        .order('display_order');

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast.error('Failed to load featured vendors');
    } finally {
      setLoading(false);
    }
  };

  const trackVendorClick = async (vendor: Vendor) => {
    try {
      const clickData: any = {
        vendor_id: vendor.id,
        referrer_page: '/dashboard',
        clicked_at: new Date().toISOString(),
      };

      if (user) {
        clickData.user_id = user.id;
        clickData.user_email = user.email;
        clickData.user_name = user.user_metadata?.full_name || user.email;
      }

      const { error } = await supabase
        .from('vendor_clicks')
        .insert(clickData);

      if (error) {
        console.error('Error tracking vendor click:', error);
      }
    } catch (error) {
      console.error('Failed to track vendor click:', error);
    }
  };

  const handleVendorClick = (vendor: Vendor, e: React.MouseEvent) => {
    e.preventDefault();
    trackVendorClick(vendor);
    navigate(`/vendors/${vendor.slug}`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Featured Vendors</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Featured Vendors
        </CardTitle>
        <CardDescription>
          Trusted businesses serving the Unimog community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              onClick={(e) => handleVendorClick(vendor, e)}
              className="block cursor-pointer"
            >
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-sand-beige/50 hover:bg-sand-beige">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-24 h-24 rounded-lg bg-military-green/10 flex items-center justify-center border-2 border-camo-brown/20">
                    {vendor.logo_url ? (
                      <img
                        src={vendor.logo_url}
                        alt={vendor.business_name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Building2 className="h-12 w-12 text-military-green" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="font-semibold text-mud-black">
                        {vendor.business_name}
                      </h3>
                      {vendor.is_verified && (
                        <CheckCircle2 className="h-4 w-4 text-military-green" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {vendor.tagline}
                    </p>
                  </div>

                  {vendor.specialties && vendor.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {vendor.specialties.slice(0, 2).map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {vendor.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{vendor.specialties.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-military-green text-military-green hover:bg-military-green hover:text-white"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px] bg-sand-beige/30">
            <div className="w-24 h-24 rounded-lg bg-military-green/5 flex items-center justify-center border-2 border-dashed border-military-green/20">
              <Plus className="h-12 w-12 text-military-green/40" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-mud-black">Add Your Business</h3>
              <p className="text-sm text-muted-foreground">
                Coming soon
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
