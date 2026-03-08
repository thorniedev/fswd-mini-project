import type { Product } from '@/features/products/types';

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  total: number;
  count: number;
};
