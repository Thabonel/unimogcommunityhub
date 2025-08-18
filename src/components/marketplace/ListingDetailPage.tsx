
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronLeft, MapPin, Calendar, MessageSquare, Shield, Heart, Eye, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { useListingDetail, useSaveListing, useSavedListings } from '@/hooks/use-marketplace';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { PayPalButton } from '@/components/marketplace/PayPalButton';

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: listing, isLoading, error } = useListingDetail(id);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const { user } = useAuth();
  const { data: savedListings = [] } = useSavedListings();
  const saveMutation = useSaveListing();
  
  const isSaved = savedListings.includes(id || '');
  
  const handleSaveClick = () => {
    if (!user) {
      toast.error('Please sign in to save listings');
      return;
    }
    if (id) {
      saveMutation.mutate({ listingId: id, save: !isSaved });
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading listing details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !listing) {
    return (
      <div className="container max-w-4xl py-8">
        <Link to="/marketplace" className="text-primary hover:underline flex items-center mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Marketplace
        </Link>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Listing not found</h2>
          <p className="text-muted-foreground mb-6">This listing may have been removed or is no longer available.</p>
          <Button asChild>
            <Link to="/marketplace">Browse other listings</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Mock seller email for demo purposes
  // In a real implementation, this would come from the listing data
  const sellerEmail = `${listing.sellerName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
  
  // Enhanced listing type for Facebook style
  const enhancedListing = listing as typeof listing & { 
    timeAgo?: string; 
    viewCount?: number; 
    savedCount?: number;
    memberSince?: number | null;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container max-w-6xl py-3">
          <Link to="/marketplace" className="text-gray-600 hover:text-gray-900 flex items-center text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Marketplace
          </Link>
        </div>
      </div>
      
      <div className="container max-w-6xl py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm">
          
              {/* Image Carousel */}
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {listing.photos.map((photo, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-[4/3] bg-gray-100">
                          <img
                            src={photo}
                            alt={`${listing.title} - Photo ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {listing.photos.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
              </div>
              
              {/* Title and Actions */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-semibold mb-2">{listing.title}</h1>
                    <div className="text-2xl font-bold">${listing.price.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveClick}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Save listing"
                    >
                      <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Share listing"
                    >
                      <Share2 className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                {/* Stats and Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  {listing.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.location}</span>
                    </div>
                  )}
                  <span>Listed {enhancedListing.timeAgo || 'recently'}</span>
                  {enhancedListing.viewCount !== undefined && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{enhancedListing.viewCount} views</span>
                    </div>
                  )}
                  {enhancedListing.savedCount !== undefined && enhancedListing.savedCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{enhancedListing.savedCount} saved</span>
                    </div>
                  )}
                </div>
                
                {/* Condition Badge */}
                <div className="mb-6">
                  <Badge variant="secondary" className="text-sm">
                    Condition: {listing.condition}
                  </Badge>
                </div>
          
                {/* Description */}
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-3">Details</h2>
                  <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
                </div>
              </div>
            </div>
          </div>
        
          <div className="lg:col-span-4 space-y-4">
            {/* Seller Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Seller information</h3>
              
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={listing.sellerAvatar} alt={listing.sellerName} />
                  <AvatarFallback>{listing.sellerName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{listing.sellerName}</div>
                  <div className="text-sm text-gray-500">
                    {enhancedListing.memberSince ? `Joined in ${enhancedListing.memberSince}` : 'Member'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowContactInfo(!showContactInfo)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message seller
                </Button>
                
                {showContactInfo && (
                  <div className="p-4 bg-gray-50 rounded-lg text-sm space-y-2">
                    <p className="font-medium">Contact Information:</p>
                    <p>Email: {sellerEmail}</p>
                    <p>Phone: (555) 123-4567</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Please mention you found this listing on Unimog Community Hub
                    </p>
                  </div>
                )}
                
                <Link 
                  to={`/marketplace?sellerId=${listing.sellerId}`}
                  className="block w-full"
                >
                  <Button variant="outline" className="w-full">
                    View seller's other listings
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Purchase Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-2xl font-bold mb-4">${listing.price.toLocaleString()}</div>
              
              <PayPalButton 
                amount={listing.price} 
                itemName={listing.title} 
                sellerEmail={sellerEmail}
                sellerId={listing.sellerId}
                sellerName={listing.sellerName}
                listingId={listing.id}
              />
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Buyer Protection</p>
                  <p className="text-xs text-gray-600">Secure payments via PayPal with buyer protection.</p>
                </div>
              </div>
            </div>
            
            {/* Location Card */}
            {listing.location && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold mb-3">Location</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.location}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Approximate location - contact seller for exact address
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
