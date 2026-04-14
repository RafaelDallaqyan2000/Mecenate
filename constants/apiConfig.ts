import Constants from 'expo-constants';

function readExtra(): { base: string; user: string } {
  const extra = Constants.expoConfig?.extra as
    | { EXPO_PUBLIC_API_BASE_URL?: string; EXPO_PUBLIC_API_USER_ID?: string }
    | undefined;
  return {
    base: extra?.EXPO_PUBLIC_API_BASE_URL?.trim() ?? '',
    user: extra?.EXPO_PUBLIC_API_USER_ID?.trim() ?? '',
  };
}

const extra = readExtra();

export const API_BASE_URL =
  extra.base  || '';

export const API_USER_ID =
  extra.user || '';

export const FEED_PAGE_SIZE = 10;
