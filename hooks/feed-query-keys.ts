import type { FeedTierFilter } from '@/types/feed';

export const feedPostsQueryKeyRoot = ['feed', 'posts'] as const;

export function feedPostsQueryKey(tier: FeedTierFilter) {
  return ['feed', 'posts', tier] as const;
}

export function postDetailQueryKey(postId: string) {
  return ['post', postId] as const;
}

export function postCommentsQueryKey(postId: string) {
  return ['comments', postId] as const;
}

