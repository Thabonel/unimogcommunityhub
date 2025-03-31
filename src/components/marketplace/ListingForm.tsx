import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Upload, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  marketplaceCategories, 
  listingConditions,
  commissionStructure
} from '@/types/marketplace';
import { useCreateListing } from '@/hooks/use-marketplace';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CommissionCalculator } from './CommissionCalculator';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  category: z.string().nonempty('Please select a category'),
  condition: z.string().nonempty('Please select a condition'),
  location: z.string().optional(),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and conditions' }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

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

  // Watch the price to update commission information
  const currentPrice = form.watch('price') || 0;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: File[] = [];
    const invalidFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (file too large, max 5MB)`);
        continue;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        invalidFiles.push(`${file.name} (invalid file type, must be JPG, PNG or WebP)`);
        continue;
      }
      newPhotos.push(file);
    }

    if (invalidFiles.length > 0) {
      toast({
        title: 'Some files could not be uploaded',
        description: (
          <ul className="list-disc pl-4">
            {invalidFiles.map((file, i) => (
              <li key={i}>{file}</li>
            ))}
          </ul>
        ),
        variant: 'destructive',
      });
    }

    if (photos.length + newPhotos.length > 10) {
      toast({
        title: 'Too many images',
        description: 'You can upload a maximum of 10 images',
        variant: 'destructive',
      });
      return;
    }

    setPhotos([...photos, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

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
        <div className="mb-6 bg-amber-50 dark:bg-amber-950/30 rounded-md p-4 border border-amber-200 dark:border-amber-800">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-amber-600" />
            Commission Information
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            The Unimog Marketplace charges a {commissionStructure.percentage}% commission on all sales.
            This fee helps maintain our platform and provide secure transactions for all users.
          </p>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the title of your item" {...field} />
              </FormControl>
              <FormDescription>
                A clear, descriptive title will attract more buyers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your item in detail"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include details like model, specifications, condition, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {currentPrice > 0 && (
              <CommissionCalculator price={currentPrice} />
            )}
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {marketplaceCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {listingConditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., New York, NY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Photos <span className="text-muted-foreground">(up to 10)</span>
          </label>
          <div className="flex flex-wrap gap-4 mb-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative w-24 h-24 rounded-md overflow-hidden border"
              >
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                  aria-label="Remove photo"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
            {photos.length < 10 && (
              <div className="w-24 h-24 flex items-center justify-center border border-dashed rounded-md">
                <label
                  htmlFor="photos"
                  className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-sm text-muted-foreground"
                >
                  <Upload className="h-6 w-6 mb-1" />
                  <span>Upload</span>
                </label>
                <input
                  id="photos"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handlePhotoUpload}
                  className="sr-only"
                />
              </div>
            )}
          </div>
          {photos.length === 0 && (
            <p className="text-sm text-destructive mb-2">At least one photo is required</p>
          )}
        </div>

        <FormField
          control={form.control}
          name="agreedToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the <a href="#" className="text-primary underline">Terms and Conditions</a> of the Unimog Marketplace
                </FormLabel>
                <FormDescription>
                  By checking this box, you agree to our marketplace rules and policies, including the {commissionStructure.percentage}% commission on sales.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

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
