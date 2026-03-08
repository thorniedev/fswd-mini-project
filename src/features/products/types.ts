export type Category = {
  id: number;
  name: string;
  slug?: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  id: number;
  title: string;
  slug?: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductFilters = {
  title?: string;
  categoryId?: number;
  price_min?: number;
  price_max?: number;
  offset?: number;
  limit?: number;
};

export type CreateProductDto = {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
};

export type UpdateProductDto = Partial<CreateProductDto>;
