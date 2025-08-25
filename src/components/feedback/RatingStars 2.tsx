
import { Star } from 'lucide-react';
import { useState } from 'react';

interface RatingStarsProps {
  rating?: number;
  onChange: (rating: number) => void;
  size?: number;
}

export function RatingStars({ rating, onChange, size = 24 }: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`cursor-pointer transition-colors ${
            (hoverRating !== null ? hoverRating >= star : rating && rating >= star)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(null)}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
}
