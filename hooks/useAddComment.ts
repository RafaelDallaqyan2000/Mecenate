import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API_USER_ID } from '@/constants/apiConfig';
import {
  feedPostsQueryKeyRoot,
  postCommentsQueryKey,
  postDetailQueryKey,
} from '@/hooks/feed-query-keys';
import { addComment } from '@/services/commentsService';
import type { Comment, CommentsPage, Post, PostsPage } from '@/types/feed';

interface MutationContext {
  tempId: string;
}

interface MutationVars {
  postId: string;
  text: string;
}

function buildTempComment(postId: string, text: string, tempId: string): Comment {
  return {
    id: tempId,
    postId,
    author: {
      id: API_USER_ID || 'me',
      username: '',
      displayName: 'Вы',
      avatarUrl: '',
    },
    text,
    createdAt: new Date().toISOString(),
  };
}

function prependToFirstPage(
  data: InfiniteData<CommentsPage> | undefined,
  comment: Comment
): InfiniteData<CommentsPage> | undefined {
  if (!data || data.pages.length === 0) {
    return {
      pageParams: [undefined as unknown as string | undefined],
      pages: [{ comments: [comment], nextCursor: null, hasMore: false }],
    };
  }
  const [first, ...rest] = data.pages;
  return {
    pageParams: data.pageParams,
    pages: [{ ...first, comments: [comment, ...first.comments] }, ...rest],
  };
}

interface ReplaceResult {
  next: InfiniteData<CommentsPage> | undefined;
  alreadyHadReal: boolean;
}

function replaceInFirstPage(
  data: InfiniteData<CommentsPage> | undefined,
  tempId: string,
  real: Comment
): ReplaceResult {
  if (!data) return { next: data, alreadyHadReal: false };
  let alreadyHadReal = false;
  const next: InfiniteData<CommentsPage> = {
    pageParams: data.pageParams,
    pages: data.pages.map((page, idx) => {
      if (idx !== 0) return page;
      const hasReal = page.comments.some((c) => c.id === real.id);
      if (hasReal) alreadyHadReal = true;
      const filtered = page.comments.filter((c) => c.id !== tempId);
      return {
        ...page,
        comments: hasReal ? filtered : [real, ...filtered.filter((c) => c.id !== real.id)],
      };
    }),
  };
  return { next, alreadyHadReal };
}

function removeFromFirstPage(
  data: InfiniteData<CommentsPage> | undefined,
  tempId: string
): InfiniteData<CommentsPage> | undefined {
  if (!data) return data;
  return {
    pageParams: data.pageParams,
    pages: data.pages.map((page, idx) =>
      idx === 0
        ? { ...page, comments: page.comments.filter((c) => c.id !== tempId) }
        : page
    ),
  };
}

function adjustCommentCount(
  qc: ReturnType<typeof useQueryClient>,
  postId: string,
  delta: number
) {
  qc.setQueryData<Post>(postDetailQueryKey(postId), (old) =>
    old ? { ...old, commentsCount: Math.max(0, old.commentsCount + delta) } : old
  );
  qc.setQueriesData<InfiniteData<PostsPage>>({ queryKey: feedPostsQueryKeyRoot }, (old) => {
    if (!old) return old;
    return {
      pageParams: old.pageParams,
      pages: old.pages.map((page) => ({
        ...page,
        posts: page.posts.map((p) =>
          p.id === postId ? { ...p, commentsCount: Math.max(0, p.commentsCount + delta) } : p
        ),
      })),
    };
  });
}

export function useAddComment() {
  const qc = useQueryClient();

  return useMutation<Comment, Error, MutationVars, MutationContext>({
    mutationFn: ({ postId, text }) => addComment(postId, text),
    onMutate: async ({ postId, text }) => {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      await qc.cancelQueries({ queryKey: postCommentsQueryKey(postId) });
      const tempComment = buildTempComment(postId, text, tempId);
console.log(tempComment, '1111111111111111111');

      qc.setQueryData<InfiniteData<CommentsPage>>(postCommentsQueryKey(postId), (old) =>
        prependToFirstPage(old, tempComment)
      );

      adjustCommentCount(qc, postId, 1);

      return { tempId };
    },
    onError: (_err, { postId }, ctx) => {
      if (!ctx) return;
      qc.setQueryData<InfiniteData<CommentsPage>>(postCommentsQueryKey(postId), (old) =>
        removeFromFirstPage(old, ctx.tempId)
      );
      adjustCommentCount(qc, postId, -1);
    },
    onSuccess: (real, { postId }, ctx) => {
      if (!ctx) return;
      let alreadyHadReal = false;
      qc.setQueryData<InfiniteData<CommentsPage>>(postCommentsQueryKey(postId), (old) => {
        const result = replaceInFirstPage(old, ctx.tempId, real);
        alreadyHadReal = result.alreadyHadReal;
        return result.next;
      });
      if (alreadyHadReal) {
        adjustCommentCount(qc, postId, -1);
      }
    },
  });
}
