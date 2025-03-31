
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronLeft, MapPin, Calendar, ArrowRight, MessageSquare, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { useListingDetail } from '@/hooks/use-marketplace';
import { PayPalButton } from '@/components/marketplace/PayPalButton';

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: listing, isLoading, error } = useListingDetail(id);
  const [showContactInfo, setShowContactInfo] = useState(false);
  
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
  
  return (
    <div className="container max-w-4xl py-8">
      <Link to="/marketplace" className="text-primary hover:underline flex items-center mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Marketplace
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Badge variant="outline" className="font-normal">
              {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
            </Badge>
            <Badge variant="secondary">{listing.condition}</Badge>
            {listing.location && (
              <span className="text-sm text-muted-foreground flex items-center">
                <MapPin className="h-3 w-3 mr-1" /> {listing.location}
              </span>
            )}
            <span className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(listing.createdAt), 'PPP')}
            </span>
          </div>
          
          <div className="mb-6 relative">
            <Carousel className="w-full">
              <CarouselContent>
                {listing.photos.map((photo, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[4/3] bg-secondary/10 rounded-lg overflow-hidden">
                      <img
                        src={photo}
                        alt={`${listing.title} - Photo ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="whitespace-pre-line">{listing.description}</p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <div className="border rounded-lg p-4 sticky top-24">
            <div className="text-2xl font-bold mb-4">${listing.price}</div>
            
            <div className="space-y-6">
              <PayPalButton amount={listing.price} itemName={listing.title} />
              
              <Separator />
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Avatar>
                    <AvatarImage src={listing.sellerAvatar} alt={listing.sellerName} />
                    <AvatarFallback>{listing.sellerName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{listing.sellerName}</div>
                    <div className="text-xs text-muted-foreground">Member since 2020</div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full mt-2 flex items-center justify-center gap-2"
                  onClick={() => setShowContactInfo(!showContactInfo)}
                >
                  <MessageSquare className="h-4 w-4" />
                  {showContactInfo ? 'Hide contact info' : 'Contact seller'}
                </Button>
                
                {showContactInfo && (
                  <div className="mt-4 p-3 bg-secondary/20 rounded-md text-sm">
                    <p>Email: seller@example.com</p>
                    <p>Phone: (555) 123-4567</p>
                  </div>
                )}
              </div>
              
              <div className="bg-secondary/10 rounded-md p-3 text-sm flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">Buyer Protection</p>
                  <p className="text-xs text-muted-foreground">All transactions are secured by PayPal buyer protection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
