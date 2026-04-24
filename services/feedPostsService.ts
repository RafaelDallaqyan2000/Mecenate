import { FEED_PAGE_SIZE } from '@/constants/apiConfig';
import { apiGetJson } from '@/lib/api/httpClient';
import type { FeedTierFilter, Post, PostsPage } from '@/types/feed';

interface PostsResponsePayload {
  ok: boolean;
  data?: {
    posts: Post[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

function toServerTier(filter: FeedTierFilter): 'free' | 'paid' | undefined {
  return filter === 'all' ? undefined : filter;
}

export interface FetchPostsPageParams {
  cursor?: string;
  tier: FeedTierFilter;
}

export async function fetchPostsPage({ cursor, tier }: FetchPostsPageParams): Promise<PostsPage> {
  const json = await apiGetJson<PostsResponsePayload>('/posts', {
    limit: FEED_PAGE_SIZE,
    cursor: cursor || undefined,
    tier: toServerTier(tier),
  });
  if (!json.ok || !json.data) {
    throw new Error('Bad response');
  }
  return {
    posts: json.data.posts,
    nextCursor: json.data.nextCursor,
    hasMore: json.data.hasMore,
  };
}
