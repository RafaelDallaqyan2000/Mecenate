const DEFAULT_API_BASE_URL = 'https://k8s.mectest.ru/test-app';
const DEFAULT_API_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

export const API_USER_ID =
  process.env.EXPO_PUBLIC_API_USER_ID?.trim() || DEFAULT_API_USER_ID;

export const FEED_PAGE_SIZE = 10;
