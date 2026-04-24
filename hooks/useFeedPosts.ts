import type { InfiniteData } from '@tanstack/react-query';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { feedPostsQueryKey } from '@/hooks/feed-query-keys';
import { fetchPostsPage } from '@/services/feedPostsService';
import { togglePostLike } from '@/services/postLikeService';
import type { FeedTierFilter, Post, PostsPage } from '@/types/feed';

export interface UseFeedPostsParams {
  tier: FeedTierFilter;
}

export interface UseFeedPostsResult {
  posts: Post[];
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  isEmptyFatalError: boolean;
  isRefreshError: boolean;
  isMoreError: boolean;
  hasMore: boolean;
  refresh: () => void;
  loadMore: () => void;
  retryFatal: () => void;
  retryRefresh: () => void;
  retryMore: () => void;
  onLikePress: (postId: string) => void;
}

export function useFeedPosts({ tier }: UseFeedPostsParams): UseFeedPostsResult {
  const qc = useQueryClient();
  const [isMoreError, setIsMoreError] = useState(false);

  const queryKey = feedPostsQueryKey(tier);

  const query = useInfiniteQuery({
    queryKey,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      fetchPostsPage({ cursor: pageParam, tier }),
    getNextPageParam: (lastPage: PostsPage) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.nextCursor ?? undefined;
    },
  });

  const posts = useMemo(() => query.data?.pages.flatMap((p) => p.posts) ?? [], [query.data]);

  const likeMutation = useMutation({
    mutationFn: (postId: string) => togglePostLike(postId),
    onSuccess: (data, postId) => {
      qc.setQueryData<InfiniteData<PostsPage>>(queryKey, (old) => {
        if (!old) return old;
        return {
          pageParams: old.pageParams,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((p) =>
              p.id === postId ? { ...p, isLiked: data.isLiked, likesCount: data.likesCount } : p
            ),
          })),
        };
      });
    },
  });

  const isEmptyFatalError = query.isError && query.data === undefined;
  const isRefreshError = query.isError && query.data !== undefined && !isMoreError;
  const isInitialLoading = query.isPending;
  const isRefreshing = query.isRefetching && !query.isFetchingNextPage;
  const isLoadingMore = query.isFetchingNextPage;
  const hasMore = query.hasNextPage ?? false;

  const refresh = useCallback(() => {
    setIsMoreError(false);
    void query.refetch();
  }, [query]);

  const loadMore = useCallback(() => {
    if (!query.hasNextPage || query.isFetchingNextPage || isMoreError || isEmptyFatalError) return;
    void query.fetchNextPage().catch(() => setIsMoreError(true));
  }, [query, isMoreError, isEmptyFatalError]);

  const retryFatal = useCallback(() => {
    setIsMoreError(false);
    void qc.resetQueries({ queryKey });
  }, [qc, queryKey]);

  const retryRefresh = useCallback(() => {
    setIsMoreError(false);
    void query.refetch();
  }, [query]);

  const retryMore = useCallback(() => {
    setIsMoreError(false);
    void query.fetchNextPage().catch(() => setIsMoreError(true));
  }, [query]);

  const onLikePress = useCallback(
    (postId: string) => {
      likeMutation.mutate(postId);
    },
    [likeMutation]
  );

  return {
    posts,
    isInitialLoading,
    isRefreshing,
    isLoadingMore,
    isEmptyFatalError,
    isRefreshError,
    isMoreError,
    hasMore,
    refresh,
    loadMore,
    retryFatal,
    retryRefresh,
    retryMore,
    onLikePress,
  };
}
