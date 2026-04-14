import { API_BASE_URL, API_USER_ID } from '@/constants/apiConfig';
import axios, { AxiosError, type AxiosInstance } from 'axios';

function getBaseUrl(): string {
  const normalized = API_BASE_URL.trim().replace(/\/+$/, '');

  if (!normalized) {
    throw new Error('API_BASE_URL is not configured');
  }

  return normalized;
}

function withLeadingSlash(path: string): string {
  return `/${path.replace(/^\/+/, '')}`;
}

export class ApiRequestError extends Error {
  status: number;
  isNetworkError: boolean;

  constructor(message: string, status = 0, isNetworkError = false) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

function toApiRequestError(error: unknown): ApiRequestError {
  if (!axios.isAxiosError(error)) {
    return new ApiRequestError('Unexpected error');
  }

  const axiosError = error as AxiosError;
  const status = axiosError.response?.status ?? 0;

  if (!axiosError.response) {
    return new ApiRequestError('Network error', 0, true);
  }

  return new ApiRequestError(`HTTP ${status}`, status, false);
}

export const apiHttp: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${API_USER_ID}`,
  },
});

export async function apiGetJson<T>(
  path: string,
  searchParams?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  try {
    const response = await apiHttp.get<T>(withLeadingSlash(path), {
      params: searchParams,
    });

    return response.data;
  } catch (error) {
    throw toApiRequestError(error);
  }
}

export async function apiPostJson<T>(
  path: string,
  body?: unknown
): Promise<T> {
  try {
    const response = await apiHttp.post<T>(withLeadingSlash(path), body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw toApiRequestError(error);
  }
}