import { apiFetch } from '@/lib/api/client';
import { getRequiredApiBaseUrl } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { User, CreateUserDto, UpdateUserDto } from '@/features/users/types';

export async function getUsers(limit = 20, offset = 0): Promise<User[]> {
  return apiFetch<User[]>(`${API_ENDPOINTS.users}?limit=${limit}&offset=${offset}`, {
    nextRevalidate: 120,
  });
}

export async function getUserById(id: number): Promise<User> {
  return apiFetch<User>(`${API_ENDPOINTS.users}/${id}`, { nextRevalidate: 120 });
}

export async function createUser(data: CreateUserDto): Promise<User> {
  return apiFetch<User>(API_ENDPOINTS.users, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUser(id: number, data: UpdateUserDto, token: string): Promise<User> {
  return apiFetch<User>(`${API_ENDPOINTS.users}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    token,
  });
}

export async function deleteUser(id: number, token: string): Promise<boolean> {
  return apiFetch<boolean>(`${API_ENDPOINTS.users}/${id}`, {
    method: 'DELETE',
    token,
  });
}

type UploadFileResponse = {
  location: string;
};

export async function uploadUserAvatar(file: File, token?: string): Promise<string> {
  const apiBaseUrl = getRequiredApiBaseUrl();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${apiBaseUrl}/files/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Avatar upload failed (${response.status})`);
  }

  const data = (await response.json()) as UploadFileResponse;
  if (!data.location) {
    throw new Error('Avatar upload did not return a URL');
  }

  return data.location;
}
