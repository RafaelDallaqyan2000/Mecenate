import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommentItem } from '@/components/comments/CommentItem';
import { CommentsSectionHeader } from '@/components/comments/CommentsSectionHeader';
import { feedColors, feedFonts } from '@/components/feed/feedTheme';
import { PostDetailHeader } from '@/components/post/PostDetailHeader';
import { AppButton } from '@/components/ui/AppButton';
import type { Comment, CommentsSortMode, Post } from '@/types/feed';

export interface PostDetailViewProps {
  post: Post | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onLikePress: (postId: string) => void;
  onBackPress?: () => void;
  comments: Comment[];
  commentsInitialLoading: boolean;
  commentsLoadingMore: boolean;
  commentsError: boolean;
  hasMoreComments: boolean;
  onCommentsEndReached: () => void;
  commentsSort: CommentsSortMode;
  onCommentsSortChange: (next: CommentsSortMode) => void;
  composerSlot?: React.ReactNode;
}

export function PostDetailView({
  post,
  isLoading,
  isError,
  onRetry,
  onLikePress,
  onBackPress,
  comments,
  commentsInitialLoading,
  commentsLoadingMore,
  commentsError,
  hasMoreComments,
  onCommentsEndReached,
  commentsSort,
  onCommentsSortChange,
  composerSlot,
}: PostDetailViewProps) {
  const renderItem = useCallback<ListRenderItem<Comment>>(
    ({ item }) => <CommentItem comment={item} />,
    []
  );

  if (isLoading && !post) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]} edges={['top']}>
        <ActivityIndicator size="large" color={feedColors.primary} />
      </SafeAreaView>
    );
  }

  if (isError && !post) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]} edges={['top']}>
        <AppButton title="Повторить" onPress={onRetry} />
      </SafeAreaView>
    );
  }

  if (!post) {
    return <SafeAreaView style={styles.safe} edges={['top']} />;
  }

  const listHeader = (
    <View>
      <PostDetailHeader
        post={post}
        onLikePress={() => onLikePress(post.id)}
        onBackPress={onBackPress}
      />
      <CommentsSectionHeader
        count={post.commentsCount}
        sort={commentsSort}
        onSortChange={onCommentsSortChange}
      />
    </View>
  );
  const showEmptyComments = !commentsInitialLoading && !commentsError && comments.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>
        <FlatList
          data={comments}
          keyExtractor={(c) => c.id}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            commentsInitialLoading ? (
              <View style={styles.commentsStatus}>
                <ActivityIndicator size="small" color={feedColors.primary} />
              </View>
            ) : commentsError ? (
              <View style={styles.commentsStatus}>
                <Text style={styles.commentsEmpty}>Не удалось загрузить комментарии</Text>
              </View>
            ) : showEmptyComments ? (
              <View style={styles.commentsStatus}>
                <Text style={styles.commentsEmpty}>Пока нет комментариев</Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            commentsLoadingMore ? (
              <View style={styles.commentsStatus}>
                <ActivityIndicator size="small" color={feedColors.primary} />
              </View>
            ) : null
          }
          onEndReached={hasMoreComments ? onCommentsEndReached : undefined}
          onEndReachedThreshold={0.4}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
        {composerSlot}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: feedColors.screenBgLight,
  },
  kav: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  commentsStatus: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: feedColors.cardBg,
  },
  commentsEmpty: {
    fontFamily: feedFonts.bodyMedium,
    fontSize: 14,
    color: feedColors.textSecondary,
  },
});
