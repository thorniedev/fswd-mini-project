export type {
  Category,
  Product,
  ProductFilters,
  CreateProductDto,
  UpdateProductDto,
} from '@/features/products/types';
export type { User, CreateUserDto, UpdateUserDto } from '@/features/users/types';
export type { LoginDto, AuthTokens } from '@/features/auth/types';
export type { Cart, CartItem } from '@/features/cart/types';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
