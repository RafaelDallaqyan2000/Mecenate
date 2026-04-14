import { FEED_PAGE_SIZE } from '@/constants/apiConfig';
import { apiGetJson } from '@/lib/api/httpClient';
import type { Post, PostsPage } from '@/types/feed';

interface PostsResponsePayload {
  ok: boolean;
  data?: {
    posts: Post[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export async function fetchPostsPage(cursor?: string): Promise<PostsPage> {
  const json = await apiGetJson<PostsResponsePayload>('/posts', {
    limit: FEED_PAGE_SIZE,
    cursor: cursor || undefined,
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
