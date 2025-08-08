
import { z } from 'zod';

export const formSchema = z.object({
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

export type FormValues = z.infer<typeof formSchema>;
