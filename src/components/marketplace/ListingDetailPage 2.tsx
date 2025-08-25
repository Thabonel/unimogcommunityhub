
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useListingDetail } from '@/hooks/use-marketplace';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createConversation, sendMessage } from '@/services/messageService';

export function ListingDetailPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const { data: listing, isLoading, error } = useListingDetail(listingId);
  const [message, setMessage] = useState('Hi, is this available?');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleSendMessage = async () => {
    if (!user) {
      toast.error('Please sign in to message sellers');
      return;
    }
    
    if (!listing) {
      toast.error('Listing information not available');
      return;
    }
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsSending(true);
    
    try {
      // Add listing context to the message
      const messageWithContext = `${message}\n\n[Regarding: ${listing.title} - $${listing.price.toLocaleString()}]`;
      
      // Create or get conversation with the seller
      const conversationId = await createConversation(listing.sellerId);
      
      if (!conversationId) {
        throw new Error('Failed to create conversation');
      }
      
      // Send the message
      const sentMessage = await sendMessage(listing.sellerId, messageWithContext);
      
      if (sentMessage) {
        toast.success(`Message sent to ${listing.sellerName}!`);
        // Navigate to messages page
        navigate('/messages');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
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
  
  // Format the time and location like Facebook
  const formatListingInfo = () => {
    if (!listing) return '';
    const timeAgo = (listing as any).timeAgo || 'recently';
    const location = listing.location || 'Unknown location';
    return `Listed ${timeAgo} in ${location}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container max-w-6xl py-3">
          <Link to="/marketplace" className="text-blue-600 hover:underline flex items-center text-sm font-medium">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Marketplace
          </Link>
        </div>
      </div>
      
      <div className="container max-w-6xl py-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          
              {/* Image Carousel */}
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {listing.photos.map((photo, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-square bg-gray-100">
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
                      {/* Photo count indicator */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {listing.photos.length} photos
                      </div>
                    </>
                  )}
                </Carousel>
              </div>
            </div>
            
            {/* Details Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
              <h2 className="text-lg font-semibold mb-4">Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Condition</span>
                  <span className="font-medium">{listing.condition}</span>
                </div>
                <div className="pt-2">
                  <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
                </div>
              </div>
            </div>
            
            {/* Location Section */}
            {listing.location && (
              <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">{listing.location}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Location is approximate</p>
              </div>
            )}
          
          </div>
        
          {/* Right Column - Title, Price, and Seller */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              {/* Title and Price */}
              <h1 className="text-2xl font-semibold mb-2">{listing.title}</h1>
              <div className="text-2xl font-bold mb-1">${listing.price.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mb-6">{formatListingInfo()}</div>
              
              {/* Seller Information */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Seller information</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={listing.sellerAvatar} alt={listing.sellerName} />
                    <AvatarFallback>{listing.sellerName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{listing.sellerName}</div>
                    <div className="text-sm text-gray-500">
                      Joined Unimog Community {((listing as any).memberSince || new Date().getFullYear())}
                    </div>
                  </div>
                </div>
                
                {/* Message Form */}
                <div className="space-y-3">
                  <h4 className="font-medium">Send seller a message</h4>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi, is this available?"
                    className="min-h-[80px]"
                    disabled={isSending}
                  />
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSendMessage}
                    disabled={isSending || !message.trim()}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {isSending ? 'Sending...' : 'Send Message'}
                  </Button>
                  
                  {user && (
                    <p className="text-xs text-gray-500 text-center">
                      Messages are sent through the Unimog Community Hub messaging system
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
