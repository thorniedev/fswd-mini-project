import { apiFetch } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Product, Category, ProductFilters } from '@/features/products/types';

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters.title) params.set('title', filters.title);
  if (filters.categoryId) params.set('categoryId', String(filters.categoryId));
  if (filters.price_min !== undefined) params.set('price_min', String(filters.price_min));
  if (filters.price_max !== undefined) params.set('price_max', String(filters.price_max));
  if (filters.offset !== undefined) params.set('offset', String(filters.offset));
  if (filters.limit !== undefined) params.set('limit', String(filters.limit));

  const query = params.toString();
  return apiFetch<Product[]>(`${API_ENDPOINTS.products}${query ? `?${query}` : ''}`, {
    nextRevalidate: 60,
  });
}

export async function getProductById(id: number): Promise<Product> {
  return apiFetch<Product>(`${API_ENDPOINTS.products}/${id}`, { cache: 'no-store' });
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>(API_ENDPOINTS.categories, { nextRevalidate: 300 });
}

export async function getCategoryById(id: number): Promise<Category> {
  return apiFetch<Category>(`${API_ENDPOINTS.categories}/${id}`, { nextRevalidate: 300 });
}
