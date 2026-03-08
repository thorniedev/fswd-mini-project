import { z } from 'zod';

export const userRoleSchema = z.enum(['customer', 'admin']);

export const adminCreateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  avatarFile: z.any().optional(),
  role: userRoleSchema,
});

export const adminUpdateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  avatarFile: z.any().optional(),
  role: userRoleSchema,
  password: z
    .string()
    .min(4, 'Password must be at least 4 characters')
    .or(z.literal(''))
    .optional(),
});

export const selfUpdateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  avatarFile: z.any().optional(),
  password: z
    .string()
    .min(4, 'Password must be at least 4 characters')
    .or(z.literal(''))
    .optional(),
});

export type AdminCreateUserFormData = z.infer<typeof adminCreateUserSchema>;
export type AdminUpdateUserFormData = z.infer<typeof adminUpdateUserSchema>;
export type SelfUpdateUserFormData = z.infer<typeof selfUpdateUserSchema>;
