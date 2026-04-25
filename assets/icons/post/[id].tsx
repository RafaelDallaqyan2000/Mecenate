import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import { CommentComposer } from '@/components/comments/CommentComposer';
import { PostDetailView } from '@/components/post/PostDetailView';
import {
  feedPostsQueryKeyRoot,
  postDetailQueryKey,
} from '@/hooks/feed-query-keys';
import { useAddComment } from '@/hooks/useAddComment';
import { usePostComments } from '@/hooks/usePostComments';
import { usePostDetail } from '@/hooks/usePostDetail';
import { togglePostLike } from '@/services/postLikeService';
import { useUiStore } from '@/stores';
import type { CommentsSortMode, Post, PostsPage } from '@/types/feed';

function PostDetailScreenComponent() {
  const params = useLocalSearchParams<{ id: string }>();
  const postId = params.id;
  const qc = useQueryClient();
  const router = useRouter();
  const ui = useUiStore();

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [router]);

  const { post, isLoading, isError, refetch } = usePostDetail(postId);
  const {
    comments,
    isInitialLoading: commentsInitialLoading,
    isLoadingMore: commentsLoadingMore,
    isError: commentsError,
    hasMore: hasMoreComments,
    loadMore: loadMoreComments,
  } = usePostComments({ postId, sort: ui.commentsSort });

  const likeMutation = useMutation({
    mutationFn: (id: string) => togglePostLike(id),
    onSuccess: (data, id) => {
      qc.setQueryData<Post>(postDetailQueryKey(id), (old) =>
        old ? { ...old, isLiked: data.isLiked, likesCount: data.likesCount } : old
      );
      qc.setQueriesData<InfiniteData<PostsPage>>({ queryKey: feedPostsQueryKeyRoot }, (old) => {
        if (!old) return old;
        return {
          pageParams: old.pageParams,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((p) =>
              p.id === id ? { ...p, isLiked: data.isLiked, likesCount: data.likesCount } : p
            ),
          })),
        };
      });
    },
  });

  const handleLikePress = useCallback(
    (id: string) => {
      likeMutation.mutate(id);
    },
    [likeMutation]
  );

  const addCommentMutation = useAddComment();
  const handleSubmitComment = useCallback(
    async (text: string) => {
      if (!postId) return;
      await addCommentMutation.mutateAsync({ postId, text });
    },
    [addCommentMutation, postId]
  );

  const handleCommentsSortChange = useCallback(
    (next: CommentsSortMode) => {
      ui.setCommentsSort(next);
    },
    [ui]
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PostDetailView
        post={post}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onLikePress={handleLikePress}
        onBackPress={handleBackPress}
        comments={comments}
        commentsInitialLoading={commentsInitialLoading}
        commentsLoadingMore={commentsLoadingMore}
        commentsError={commentsError}
        hasMoreComments={hasMoreComments}
        onCommentsEndReached={loadMoreComments}
        commentsSort={ui.commentsSort}
        onCommentsSortChange={handleCommentsSortChange}
        composerSlot={
          post ? (
            <CommentComposer
              onSubmit={handleSubmitComment}
              isSubmitting={addCommentMutation.isPending}
            />
          ) : null
        }
      />
    </>
  );
}

export default observer(PostDetailScreenComponent);
