import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Building2,
  CheckCircle2,
  MapPin,
  Globe,
  Mail,
  Phone,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface Vendor {
  id: string;
  slug: string;
  business_name: string;
  tagline: string;
  description: string;
  logo_url: string | null;
  hero_image_url: string | null;
  website_url: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  is_verified: boolean;
  specialties: string[];
  products: any[];
  portfolio_images: string[];
  social_links: Record<string, string>;
}

export default function VendorProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadVendor();
    }
  }, [slug]);

  const loadVendor = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setVendor(data);

      // Track profile view
      if (data) {
        trackAnalytics(data.id, 'profile_view');
      }
    } catch (error) {
      console.error('Error loading vendor:', error);
      toast.error('Failed to load vendor profile');
    } finally {
      setLoading(false);
    }
  };

  const trackAnalytics = async (vendorId: string, actionType: string) => {
    try {
      await supabase.from('vendor_analytics').insert({
        vendor_id: vendorId,
        user_id: user?.id || null,
        action_type: actionType,
        user_email: user?.email || null,
      });
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  };

  const handleWebsiteClick = (vendorId: string, websiteUrl: string) => {
    trackAnalytics(vendorId, 'website_click');
    window.open(websiteUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-muted-foreground">Loading vendor profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!vendor) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Vendor Not Found</h1>
            <p className="text-muted-foreground">
              The vendor you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-sand-beige/30">
        <div
          className="h-48 md:h-64 bg-gradient-to-r from-military-green to-military-green/80 relative"
          style={
            vendor.hero_image_url
              ? {
                  backgroundImage: `url(${vendor.hero_image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : {}
          }
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-16 relative z-10 pb-12">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-32 h-32 rounded-lg bg-white shadow-lg flex-shrink-0 flex items-center justify-center border-4 border-white">
                  {vendor.logo_url ? (
                    <img
                      src={vendor.logo_url}
                      alt={vendor.business_name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Building2 className="h-16 w-16 text-military-green" />
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-mud-black">
                        {vendor.business_name}
                      </h1>
                      {vendor.is_verified && (
                        <Badge className="bg-military-green text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-muted-foreground">{vendor.tagline}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {vendor.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {vendor.location}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {vendor.specialties?.map((specialty, idx) => (
                      <Badge key={idx} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                  {vendor.website_url && (
                    <Button
                      onClick={() => handleWebsiteClick(vendor.id, vendor.website_url!)}
                      className="bg-military-green hover:bg-military-green/90"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">About</h2>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground whitespace-pre-line">
                      {vendor.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {vendor.products && vendor.products.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Products & Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vendor.products.map((product: any, idx: number) => (
                        <div
                          key={idx}
                          className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-sand-beige/30"
                        >
                          <div className="aspect-[4/3] bg-military-green/10 overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold text-mud-black line-clamp-1">
                                {product.name}
                              </h3>
                              <Badge className="bg-military-green text-white shrink-0">
                                ${product.price}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {product.description}
                            </p>
                            {product.category && (
                              <p className="text-xs text-military-green font-medium">
                                {product.category}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {vendor.portfolio_images && vendor.portfolio_images.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {vendor.portfolio_images.map((image, idx) => (
                        <div
                          key={idx}
                          className="aspect-square rounded-lg bg-sand-beige/50 overflow-hidden"
                        >
                          <img
                            src={image}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {vendor.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-military-green mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <a
                            href={`mailto:${vendor.email}`}
                            className="text-sm text-muted-foreground hover:text-military-green"
                          >
                            {vendor.email}
                          </a>
                        </div>
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-military-green mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <a
                            href={`tel:${vendor.phone}`}
                            className="text-sm text-muted-foreground hover:text-military-green"
                          >
                            {vendor.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    {vendor.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-military-green mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">{vendor.location}</p>
                        </div>
                      </div>
                    )}
                    {vendor.website_url && (
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-military-green mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Website</p>
                          <a
                            href={vendor.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-military-green flex items-center gap-1"
                          >
                            Visit site
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <Button variant="outline" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
