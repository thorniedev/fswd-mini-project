import { apiFetch } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { LoginDto, AuthTokens } from '@/features/auth/types';
import type { User } from '@/features/users/types';

export async function login(data: LoginDto): Promise<AuthTokens> {
  return apiFetch<AuthTokens>(API_ENDPOINTS.authLogin, {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
}

export async function getProfile(token: string): Promise<User> {
  return apiFetch<User>(API_ENDPOINTS.authProfile, { token, cache: 'no-store' });
}

export async function refreshToken(refreshToken: string): Promise<AuthTokens> {
  return apiFetch<AuthTokens>(API_ENDPOINTS.authRefreshToken, {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  });
}
