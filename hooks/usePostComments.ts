import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { postCommentsQueryKey } from '@/hooks/feed-query-keys';
import { fetchCommentsPage } from '@/services/commentsService';
import type { Comment, CommentsPage, CommentsSortMode } from '@/types/feed';

export interface UsePostCommentsParams {
  postId: string | undefined;
  sort: CommentsSortMode;
}

export interface UsePostCommentsResult {
  comments: Comment[];
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

function sortComments(list: Comment[], mode: CommentsSortMode): Comment[] {
  if (mode === 'default') return list;
  const copy = list.slice();
  if (mode === 'new') {
    copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return copy;
  }
  copy.sort((a, b) => (b.likesCount ?? 0) - (a.likesCount ?? 0));
  return copy;
}

export function usePostComments({
  postId,
  sort,
}: UsePostCommentsParams): UsePostCommentsResult {
  const query = useInfiniteQuery({
    queryKey: postId ? postCommentsQueryKey(postId) : ['comments', 'empty'],
    enabled: !!postId,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      if (!postId) return Promise.reject(new Error('Missing post id'));
      return fetchCommentsPage(postId, pageParam);
    },
    getNextPageParam: (lastPage: CommentsPage) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.nextCursor ?? undefined;
    },
  });

  const flat = useMemo(
    () => query.data?.pages.flatMap((p) => p.comments) ?? [],
    [query.data]
  );

  const comments = useMemo(() => sortComments(flat, sort), [flat, sort]);

  const loadMore = useCallback(() => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    void query.fetchNextPage();
  }, [query]);

  const refetch = useCallback(() => {
    void query.refetch();
  }, [query]);

  return {
    comments,
    isInitialLoading: query.isPending,
    isLoadingMore: query.isFetchingNextPage,
    isError: query.isError,
    hasMore: query.hasNextPage ?? false,
    loadMore,
    refetch,
  };
}
