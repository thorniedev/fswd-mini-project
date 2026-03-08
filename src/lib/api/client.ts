import { ApiError, toApiError } from '@/lib/api/errors';

export function getRequiredApiBaseUrl() {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!value) {
    throw new Error('Missing NEXT_PUBLIC_API_BASE_URL environment variable');
  }
  return value;
}

type ApiFetchInit = RequestInit & {
  nextRevalidate?: number;
  token?: string;
};

export async function apiFetch<T>(
  path: string,
  init?: ApiFetchInit
): Promise<T> {
  const apiBaseUrl = getRequiredApiBaseUrl();
  const { nextRevalidate, headers, token, ...rest } = init ?? {};

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    next: nextRevalidate ? { revalidate: nextRevalidate } : undefined,
    cache: rest.method && rest.method !== 'GET' ? 'no-store' : rest.cache,
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return true as T;
  }

  return response.json() as Promise<T>;
}

export { ApiError };
