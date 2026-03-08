import { apiFetch } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Product, CreateProductDto, UpdateProductDto } from '@/features/products/types';

export async function createProduct(data: CreateProductDto, token: string): Promise<Product> {
  return apiFetch<Product>(API_ENDPOINTS.products, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

export async function updateProduct(
  id: number,
  data: UpdateProductDto,
  token: string
): Promise<Product> {
  return apiFetch<Product>(`${API_ENDPOINTS.products}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    token,
  });
}

export async function deleteProduct(id: number, token: string): Promise<boolean> {
  return apiFetch<boolean>(`${API_ENDPOINTS.products}/${id}`, {
    method: 'DELETE',
    token,
  });
}

type UploadFileResponse = {
  location: string;
};

export async function uploadProductImage(file: File, token: string): Promise<string> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.escuelajs.co/api/v1';
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${baseUrl}/files/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Image upload failed (${response.status})`);
  }

  const data = (await response.json()) as UploadFileResponse;
  if (!data.location) {
    throw new Error('Image upload did not return a URL');
  }

  return data.location;
}
