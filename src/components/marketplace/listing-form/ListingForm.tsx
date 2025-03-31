
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValues, formSchema } from '@/components/marketplace/listing-form/FormSchema';
import { FormFields } from '@/components/marketplace/listing-form/FormFields';
import { PhotoUpload } from '@/components/marketplace/listing-form/PhotoUpload';
import { CommissionInfo } from '@/components/marketplace/listing-form/CommissionInfo';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCreateListing } from '@/hooks/use-marketplace';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function ListingForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [photos, setPhotos] = React.useState<File[]>([]);
  
  const createListingMutation = useCreateListing();
  
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      category: '',
      condition: '',
      location: user?.user_metadata?.location || '',
      // Initialize as undefined instead of false to avoid type error
      agreedToTerms: undefined,
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    if (photos.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one photo",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Make sure all required fields from CreateListingData are included and not optional
      await createListingMutation.mutateAsync({
        title: data.title,
        description: data.description,
        price: data.price!,
        category: data.category,
        condition: data.condition,
        location: data.location,
        photos,
        agreedToTerms: data.agreedToTerms as true,
      });
      
      navigate('/marketplace');
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };
  
  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-6">Create Listing</h1>
      
      <CommissionInfo />
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <FormFields form={methods} />
          
          <PhotoUpload photos={photos} setPhotos={setPhotos} />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={createListingMutation.isPending}
          >
            {createListingMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Listing...
              </>
            ) : "Create Listing"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
