import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Users, Quote, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Testimonial {
  id: string;
  name: string;
  email: string;
  unimog_models: string[];
  photo_url: string | null;
  star_rating: number;
  review_text: string;
  is_featured: boolean;
  created_at: string;
  approved_at: string | null;
}

const USE_CASES = [
  { value: 'all', label: 'All Reviews' },
  { value: 'manual_search', label: 'Manual Search' },
  { value: 'barry_ai', label: 'Barry AI' },
  { value: 'trip_planning', label: 'Trip Planning' },
  { value: 'marketplace', label: 'Marketplace' }
];

export default function Testimonials() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Testimonial[];
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['testimonial-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('star_rating')
        .eq('is_approved', true);

      if (error) throw error;

      const totalReviews = data.length;
      const avgRating = data.length > 0
        ? data.reduce((sum, t) => sum + t.star_rating, 0) / data.length
        : 0;
      const fiveStarCount = data.filter(t => t.star_rating === 5).length;

      return {
        totalReviews,
        avgRating,
        fiveStarCount
      };
    }
  });

  const featuredTestimonials = testimonials?.filter(t => t.is_featured) || [];
  const regularTestimonials = testimonials?.filter(t => !t.is_featured) || [];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-500 text-yellow-500'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const TestimonialCard = ({ testimonial, featured = false }: { testimonial: Testimonial; featured?: boolean }) => (
    <Card className={`${featured ? 'border-2 border-military-green' : ''}`}>
      {featured && (
        <div className="bg-military-green text-white text-xs font-medium px-3 py-1 text-center">
          Featured Review
        </div>
      )}
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="relative">
            {testimonial.photo_url ? (
              <img
                src={testimonial.photo_url}
                alt={testimonial.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-muted"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-military-green/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-military-green">
                  {testimonial.name.charAt(0)}
                </span>
              </div>
            )}
            {testimonial.approved_at && (
              <Badge
                variant="secondary"
                className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.5"
              >
                Verified
              </Badge>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{testimonial.name}</h3>
            {testimonial.unimog_models && testimonial.unimog_models.length > 0 && (
              <div className="flex gap-2 mt-1">
                {testimonial.unimog_models.map((model, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {model}
                  </Badge>
                ))}
              </div>
            )}
            <div className="mt-2">{renderStars(testimonial.star_rating)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Quote className="h-8 w-8 text-muted-foreground/20 mb-2" />
        <p className="text-sm leading-relaxed">{testimonial.review_text}</p>
        <p className="text-xs text-muted-foreground mt-4">
          {new Date(testimonial.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="container py-12 max-w-7xl">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold">What Unimog Owners Say</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real reviews from real Unimog enthusiasts using UnimogCommunityHub
          </p>

          {stats && (
            <div className="flex justify-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-military-green">{stats.totalReviews}</div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-military-green">
                  {stats.avgRating.toFixed(1)}
                </div>
                <div className="flex gap-1 justify-center mt-1">
                  {renderStars(Math.round(stats.avgRating))}
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-military-green">
                  {stats.totalReviews > 0
                    ? Math.round((stats.fiveStarCount / stats.totalReviews) * 100)
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">5-Star Reviews</div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8 flex justify-center">
          <Button
            onClick={() => navigate('/submit-testimonial')}
            className="bg-military-green hover:bg-military-green/90"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Share Your Experience
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {featuredTestimonials.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  Featured Reviews
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredTestimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      featured
                    />
                  ))}
                </div>
              </div>
            )}

            {regularTestimonials.length > 0 && (
              <div>
                {featuredTestimonials.length > 0 && (
                  <h2 className="text-2xl font-bold mb-6">All Reviews</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularTestimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                    />
                  ))}
                </div>
              </div>
            )}

            {!isLoading && testimonials && testimonials.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No reviews yet. Be the first!</p>
                  <Button
                    onClick={() => navigate('/submit-testimonial')}
                    className="bg-military-green hover:bg-military-green/90"
                  >
                    Write a Review
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <Card className="mt-12 bg-military-green text-white">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              Join {stats?.totalReviews || 0}+ Unimog Owners
            </h3>
            <p className="mb-6 text-white/90">
              Start your 30-day free trial and experience why Unimog enthusiasts love UnimogCommunityHub
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/pricing')}
            >
              Start Free Trial
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
