import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Building2,
  CheckCircle2,
  MapPin,
  Globe,
  Mail,
  Phone,
  ArrowLeft,
  ExternalLink,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Download,
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
  const [selectedImage, setSelectedImage] = useState<{ url: string; type: 'product' | 'gallery'; index: number; data?: any } | null>(null);

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

  const handlePreviousImage = () => {
    if (!selectedImage || !vendor) return;

    if (selectedImage.type === 'product' && vendor.products) {
      const newIndex = selectedImage.index > 0 ? selectedImage.index - 1 : vendor.products.length - 1;
      setSelectedImage({
        url: vendor.products[newIndex].image,
        type: 'product',
        index: newIndex,
        data: vendor.products[newIndex]
      });
    } else if (selectedImage.type === 'gallery' && vendor.portfolio_images) {
      const newIndex = selectedImage.index > 0 ? selectedImage.index - 1 : vendor.portfolio_images.length - 1;
      setSelectedImage({
        url: vendor.portfolio_images[newIndex],
        type: 'gallery',
        index: newIndex
      });
    }
  };

  const handleNextImage = () => {
    if (!selectedImage || !vendor) return;

    if (selectedImage.type === 'product' && vendor.products) {
      const newIndex = selectedImage.index < vendor.products.length - 1 ? selectedImage.index + 1 : 0;
      setSelectedImage({
        url: vendor.products[newIndex].image,
        type: 'product',
        index: newIndex,
        data: vendor.products[newIndex]
      });
    } else if (selectedImage.type === 'gallery' && vendor.portfolio_images) {
      const newIndex = selectedImage.index < vendor.portfolio_images.length - 1 ? selectedImage.index + 1 : 0;
      setSelectedImage({
        url: vendor.portfolio_images[newIndex],
        type: 'gallery',
        index: newIndex
      });
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
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
                <div className="w-32 h-32 rounded-lg bg-white shadow-lg flex-shrink-0 flex items-center justify-center border-4 border-white p-2">
                  {vendor.logo_url ? (
                    <img
                      src={vendor.logo_url}
                      alt={vendor.business_name}
                      className="w-full h-full object-contain"
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
                          <div
                            className="aspect-[4/3] bg-military-green/10 overflow-hidden relative group cursor-pointer"
                            onClick={() => setSelectedImage({ url: product.image, type: 'product', index: idx, data: product })}
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                                <ZoomIn className="h-5 w-5 text-military-green" />
                              </div>
                            </div>
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
                          className="aspect-square rounded-lg bg-sand-beige/50 overflow-hidden relative group cursor-pointer"
                          onClick={() => setSelectedImage({ url: image, type: 'gallery', index: idx })}
                        >
                          <img
                            src={image}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                              <ZoomIn className="h-5 w-5 text-military-green" />
                            </div>
                          </div>
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

        {/* Image Lightbox Modal */}
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>
                    {selectedImage.type === 'product' && selectedImage.data
                      ? selectedImage.data.name
                      : `Gallery Image ${selectedImage.index + 1} of ${vendor?.portfolio_images?.length || 0}`
                    }
                  </span>
                  {(selectedImage.type === 'product' ? vendor?.products?.length : vendor?.portfolio_images?.length) > 1 && (
                    <span className="text-sm text-muted-foreground font-normal">
                      {selectedImage.index + 1} / {selectedImage.type === 'product' ? vendor?.products?.length : vendor?.portfolio_images?.length}
                    </span>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Full Size Image with Navigation */}
                <div className="relative">
                  <div className="max-h-[65vh] overflow-auto bg-gray-50 rounded-lg flex items-center justify-center">
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.type === 'product' && selectedImage.data ? selectedImage.data.name : `Gallery ${selectedImage.index + 1}`}
                      className="max-w-full h-auto"
                    />
                  </div>

                  {/* Navigation Arrows */}
                  {(selectedImage.type === 'product' ? vendor?.products?.length : vendor?.portfolio_images?.length) > 1 && (
                    <>
                      <button
                        onClick={handlePreviousImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-6 w-6 text-military-green" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-6 w-6 text-military-green" />
                      </button>
                    </>
                  )}
                </div>

                {/* Image Details & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">
                      {selectedImage.type === 'product' ? 'Product Details' : 'Image Details'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedImage.type === 'product' && selectedImage.data && (
                        <>
                          {selectedImage.data.price && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price:</span>
                              <Badge className="bg-military-green text-white">
                                ${selectedImage.data.price}
                              </Badge>
                            </div>
                          )}
                          {selectedImage.data.category && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Category:</span>
                              <span className="font-medium">{selectedImage.data.category}</span>
                            </div>
                          )}
                          {selectedImage.data.description && (
                            <div className="mt-2">
                              <span className="text-gray-600 block mb-1">Description:</span>
                              <p className="text-gray-800">{selectedImage.data.description}</p>
                            </div>
                          )}
                        </>
                      )}
                      {selectedImage.type === 'gallery' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gallery Image:</span>
                          <span className="font-medium">
                            {selectedImage.index + 1} of {vendor?.portfolio_images?.length || 0}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Actions</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => window.open(selectedImage.url, '_blank')}
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Open in New Tab
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleDownload(
                          selectedImage.url,
                          `${vendor?.business_name}-${selectedImage.type}-${selectedImage.index + 1}.jpg`
                        )}
                      >
                        <Download size={16} className="mr-2" />
                        Download Image
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}
