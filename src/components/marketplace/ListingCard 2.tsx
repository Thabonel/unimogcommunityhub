
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, MessageSquare } from 'lucide-react';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl?: string;
  condition: 'new' | 'used' | 'refurbished';
  categoryId: string;
  categoryName: string;
  postedAt: string;
  sellerName: string;
  sellerRating: number;
  viewCount: number;
  saveCount: number;
  messageCount: number;
}

const ListingCard = ({
  id,
  title,
  price,
  location,
  imageUrl,
  condition,
  categoryName,
  postedAt,
  sellerName,
  sellerRating,
  viewCount,
  saveCount,
  messageCount,
}: ListingCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <Link to={`/marketplace/listing/${id}`}>
        <div className="aspect-video bg-muted relative overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="object-cover w-full h-full" 
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No image available
            </div>
          )}
          <Badge 
            className="absolute top-2 right-2" 
            variant={condition === 'new' ? 'default' : 'secondary'}
          >
            {condition === 'new' ? 'New' : condition === 'refurbished' ? 'Refurbished' : 'Used'}
          </Badge>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/marketplace/listing/${id}`}>
              <h3 className="font-medium hover:text-primary transition-colors line-clamp-2">{title}</h3>
            </Link>
            <p className="text-lg font-bold mt-1">${price.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <Badge variant="outline" className="mr-2">{categoryName}</Badge>
            {location}
          </div>
          <div className="text-xs text-muted-foreground">
            {postedAt}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t flex justify-between items-center">
        <div className="text-xs">
          <Link to={`/seller/${sellerName}`} className="text-primary hover:underline">
            {sellerName}
          </Link>
          <span className="text-muted-foreground ml-1">
            {sellerRating}/5 ★
          </span>
        </div>
        
        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Eye size={14} className="mr-1" />
            <span>{viewCount}</span>
          </div>
          <div className="flex items-center">
            <Heart size={14} className="mr-1" />
            <span>{saveCount}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare size={14} className="mr-1" />
            <span>{messageCount}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
