import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  price: z.number().positive('Price must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.number().positive('Please select a category'),
  imageFile: z.any().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
