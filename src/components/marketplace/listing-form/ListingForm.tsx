
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useCreateListing } from '@/hooks/use-marketplace';
import { PhotoUpload } from './PhotoUpload';
import { CommissionInfo } from './CommissionInfo';
import { FormFields } from './FormFields';
import { formSchema, FormValues } from './FormSchema';

export function ListingForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { mutateAsync: createListing, isPending } = useCreateListing();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      category: '',
      condition: '',
      location: '',
      agreedToTerms: false as unknown as true, // This will be validated by the form before submission
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (photos.length === 0) {
      toast({
        title: 'No photos',
        description: 'Please upload at least one photo of your item',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      // Ensure agreedToTerms is true before submitting
      if (values.agreedToTerms !== true) {
        toast({
          title: 'Agreement required',
          description: 'You must agree to the terms and conditions',
          variant: 'destructive',
        });
        return;
      }
      
      // Explicitly create an object that matches the CreateListingData interface
      const listingData = {
        title: values.title,
        description: values.description,
        price: values.price,
        category: values.category,
        condition: values.condition,
        location: values.location,
        photos,
        agreedToTerms: true as const, // Use 'as const' to ensure this is the literal value 'true'
      };
      
      await createListing(listingData);
      
      toast({
        title: 'Listing created',
        description: 'Your item has been listed in the marketplace',
      });
      navigate('/marketplace');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: 'Error',
        description: 'There was an error creating your listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CommissionInfo />
        <FormFields form={form} />
        <PhotoUpload photos={photos} setPhotos={setPhotos} />
        
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isPending || uploading}
        >
          {(isPending || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending || uploading ? 'Creating Listing...' : 'Create Listing'}
        </Button>
      </form>
    </Form>
  );
}
