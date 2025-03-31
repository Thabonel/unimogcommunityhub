
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MarketplaceListing } from '@/types/marketplace';
import { mapIcon } from 'lucide-react';

interface ListingCardProps {
  listing: MarketplaceListing;
}

export function MarketplaceListingCard({ listing }: ListingCardProps) {
  return (
    <Link to={`/marketplace/${listing.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
        <div className="relative aspect-video overflow-hidden bg-secondary/10">
          {listing.photos && listing.photos.length > 0 ? (
            <img
              src={listing.photos[0]}
              alt={listing.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
          >
            {listing.condition}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2">{listing.title}</h3>
            <span className="text-lg font-bold whitespace-nowrap">${listing.price}</span>
          </div>
          
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
            {listing.description}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between border-t mt-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={listing.sellerAvatar} alt={listing.sellerName} />
              <AvatarFallback>{listing.sellerName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{listing.sellerName}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
