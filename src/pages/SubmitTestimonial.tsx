import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Star, Upload, X, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const UNIMOG_MODELS = [
  '401', '402', '404', '406', '411', '421', '425', '435', '437',
  'U1000', 'U1200', 'U1250', 'U1300', 'U1400', 'U1450', 'U1550',
  'U1600', 'U1650', 'U1700', 'U1750', 'U2100', 'U2150', 'U2400',
  'U2450', 'U3000', 'U4000', 'U5000'
];

interface TestimonialForm {
  name: string;
  email: string;
  unimog_models: string[];
  photo_url: string | null;
  star_rating: number;
  review_text: string;
  consent: boolean;
}

export default function SubmitTestimonial() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<TestimonialForm>>({
    name: '',
    email: user?.email || '',
    unimog_models: [],
    photo_url: null,
    star_rating: 0,
    review_text: '',
    consent: false
  });

  const uploadPhoto = async (file: File) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to upload a photo',
        variant: 'destructive'
      });
      return null;
    }

    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `testimonials/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Photo upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload photo. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Photo must be less than 5MB',
        variant: 'destructive'
      });
      return;
    }

    const url = await uploadPhoto(file);
    if (url) {
      setPhotoUrl(url);
      setFormData(prev => ({ ...prev, photo_url: url }));
    }
  };

  const submitMutation = useMutation({
    mutationFn: async (data: TestimonialForm) => {
      if (!user) throw new Error('Must be signed in');

      const { error } = await supabase
        .from('testimonials')
        .insert([{
          user_id: user.id,
          name: data.name,
          email: data.email,
          unimog_models: data.unimog_models,
          photo_url: data.photo_url,
          star_rating: data.star_rating,
          review_text: data.review_text,
          is_approved: false,
          is_featured: false
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: 'Review submitted!',
        description: 'Thank you! Your review will be visible once approved.'
      });
    },
    onError: (error) => {
      console.error('Submit error:', error);
      toast({
        title: 'Submission failed',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.review_text || rating === 0) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.consent) {
      toast({
        title: 'Consent required',
        description: 'Please consent to displaying your review publicly',
        variant: 'destructive'
      });
      return;
    }

    if (formData.review_text.length > 280) {
      toast({
        title: 'Review too long',
        description: 'Please keep your review under 280 characters',
        variant: 'destructive'
      });
      return;
    }

    submitMutation.mutate({
      ...formData,
      unimog_models: selectedModels,
      star_rating: rating,
      consent: true
    } as TestimonialForm);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="container py-12 max-w-2xl">
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                Your review has been submitted and is pending approval.
                We'll notify you once it's live!
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate('/testimonials')}>
                  View Testimonials
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Share Your Experience</h1>
          <p className="text-lg text-muted-foreground">
            Help other Unimog owners by sharing your experience with UnimogCommunityHub
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit Your Review</CardTitle>
            <CardDescription>
              All reviews are moderated before being published
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Your email will not be displayed publicly
                </p>
              </div>

              <div className="space-y-2">
                <Label>Unimog Model(s)</Label>
                <Select
                  onValueChange={(value) => {
                    if (!selectedModels.includes(value)) {
                      setSelectedModels([...selectedModels, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Unimog models" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIMOG_MODELS.map((model) => (
                      <SelectItem key={model} value={model}>
                        Unimog {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedModels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedModels.map((model) => (
                      <div
                        key={model}
                        className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
                      >
                        <span>{model}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedModels(selectedModels.filter(m => m !== model))}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Photo (Optional)</Label>
                <div className="flex items-center gap-4">
                  {photoUrl ? (
                    <div className="relative">
                      <img
                        src={photoUrl}
                        alt="Preview"
                        className="h-24 w-24 rounded-full object-cover border-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoUrl(null);
                          setFormData(prev => ({ ...prev, photo_url: null }));
                        }}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="photo"
                      className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-full cursor-pointer hover:bg-muted"
                    >
                      {uploadingPhoto ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground mt-1">Upload</span>
                        </>
                      )}
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                        disabled={uploadingPhoto}
                      />
                    </label>
                  )}
                  <div className="text-sm text-muted-foreground">
                    <p>Max 5MB</p>
                    <p>JPG, PNG, or GIF</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rating *</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground self-center">
                    {rating > 0 && `${rating}/5`}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review">Review *</Label>
                <Textarea
                  id="review"
                  placeholder="Share your experience with UnimogCommunityHub..."
                  value={formData.review_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
                  rows={5}
                  maxLength={280}
                  required
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.review_text?.length || 0}/280 characters
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, consent: checked as boolean }))
                  }
                />
                <label
                  htmlFor="consent"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I consent to displaying this review publicly on UnimogCommunityHub *
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-military-green hover:bg-military-green/90"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
