export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function toApiError(response: Response): Promise<ApiError> {
  const fallbackMessage = `API Error ${response.status}`;
  const payload = await response.json().catch(() => null) as
    | { message?: string }
    | null;

  return new ApiError(response.status, payload?.message ?? fallbackMessage);
}
