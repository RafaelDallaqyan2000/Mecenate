import Constants from 'expo-constants';

interface ExtraEnv {
  EXPO_PUBLIC_API_BASE_URL?: string;
  EXPO_PUBLIC_API_USER_ID?: string;
  EXPO_PUBLIC_WS_URL?: string;
}

function readExtra(): { base: string; user: string; wsUrl: string } {
  const extra = Constants.expoConfig?.extra as ExtraEnv | undefined;
  return {
    base: extra?.EXPO_PUBLIC_API_BASE_URL?.trim() ?? '',
    user: extra?.EXPO_PUBLIC_API_USER_ID?.trim() ?? '',
    wsUrl: extra?.EXPO_PUBLIC_WS_URL?.trim() ?? '',
  };
}

const extra = readExtra();

export const API_BASE_URL = extra.base || 'https://k8s.mectest.ru/test-app';

export const API_USER_ID = extra.user || '550e8400-e29b-41d4-a716-446655440000';

export const FEED_PAGE_SIZE = 10;

function deriveWsUrlFromHttp(httpBase: string, token: string): string {
  const normalized = httpBase.replace(/\/+$/, '');
  const wsBase = normalized.replace(/^http:/i, 'ws:').replace(/^https:/i, 'wss:');
  const encoded = encodeURIComponent(token);
  return `${wsBase}/ws?token=${encoded}`;
}

function buildWsUrl(configured: string, token: string): string {
  if (!configured) {
    return deriveWsUrlFromHttp(API_BASE_URL, token);
  }
  if (configured.includes('token=')) return configured;
  const separator = configured.includes('?') ? '&' : '?';
  return `${configured}${separator}token=${encodeURIComponent(token)}`;
}

export const WS_URL = buildWsUrl(extra.wsUrl, API_USER_ID);
