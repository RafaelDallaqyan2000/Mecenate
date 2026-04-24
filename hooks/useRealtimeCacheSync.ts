import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import {
  feedPostsQueryKeyRoot,
  postCommentsQueryKey,
  postDetailQueryKey,
} from '@/hooks/feed-query-keys';
import type { Comment, CommentsPage, Post, PostsPage } from '@/types/feed';
import type { WsEvent } from '@/types/realtime';

function patchLikesInFeed(qc: QueryClient, postId: string, likesCount: number) {
  qc.setQueriesData<InfiniteData<PostsPage>>({ queryKey: feedPostsQueryKeyRoot }, (old) => {
    if (!old) return old;
    return {
      pageParams: old.pageParams,
      pages: old.pages.map((page) => ({
        ...page,
        posts: page.posts.map((p) => (p.id === postId ? { ...p, likesCount } : p)),
      })),
    };
  });
}

function patchLikesInDetail(qc: QueryClient, postId: string, likesCount: number) {
  qc.setQueryData<Post>(postDetailQueryKey(postId), (old) =>
    old ? { ...old, likesCount } : old
  );
}

function patchCommentsInFeed(qc: QueryClient, postId: string, delta: number) {
  qc.setQueriesData<InfiniteData<PostsPage>>({ queryKey: feedPostsQueryKeyRoot }, (old) => {
    if (!old) return old;
    return {
      pageParams: old.pageParams,
      pages: old.pages.map((page) => ({
        ...page,
        posts: page.posts.map((p) =>
          p.id === postId
            ? { ...p, commentsCount: Math.max(0, p.commentsCount + delta) }
            : p
        ),
      })),
    };
  });
}

function patchCommentsInDetail(qc: QueryClient, postId: string, delta: number) {
  qc.setQueryData<Post>(postDetailQueryKey(postId), (old) =>
    old ? { ...old, commentsCount: Math.max(0, old.commentsCount + delta) } : old
  );
}

function prependCommentWithDedupe(
  qc: QueryClient,
  postId: string,
  comment: Comment
): boolean {
  let wasAdded = false;
  qc.setQueryData<InfiniteData<CommentsPage>>(postCommentsQueryKey(postId), (old) => {
    if (!old || old.pages.length === 0) {
      wasAdded = true;
      return {
        pageParams: [undefined as unknown as string | undefined],
        pages: [{ comments: [comment], nextCursor: null, hasMore: false }],
      };
    }
    const [first, ...rest] = old.pages;
    const exists = old.pages.some((page) => page.comments.some((c) => c.id === comment.id));
    if (exists) {
      return old;
    }
    wasAdded = true;
    return {
      pageParams: old.pageParams,
      pages: [{ ...first, comments: [comment, ...first.comments] }, ...rest],
    };
  });
  return wasAdded;
}

export function useRealtimeCacheSync(qc: QueryClient) {
  return useCallback(
    (event: WsEvent) => {
      switch (event.type) {
        case 'like_updated': {
          patchLikesInFeed(qc, event.postId, event.likesCount);
          patchLikesInDetail(qc, event.postId, event.likesCount);
          return;
        }
        case 'comment_added': {
          const added = prependCommentWithDedupe(qc, event.postId, event.comment);
          if (added) {
            patchCommentsInFeed(qc, event.postId, 1);
            patchCommentsInDetail(qc, event.postId, 1);
          }
          return;
        }
        case 'ping':
        default:
          return;
      }
    },
    [qc]
  );
}
