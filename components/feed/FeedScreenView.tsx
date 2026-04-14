import { useCallback } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FeedFatalError } from '@/components/feed/FeedFatalError';
import { FeedListFooter } from '@/components/feed/FeedListFooter';
import { FeedRefreshErrorBanner } from '@/components/feed/FeedRefreshErrorBanner';
import { PostCard } from '@/components/feed/PostCard';
import { feedColors } from '@/components/feed/feedTheme';
import type { Post } from '@/types/feed';

export interface FeedScreenViewProps {
  posts: Post[];
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  isEmptyFatalError: boolean;
  isRefreshError: boolean;
  isMoreError: boolean;
  hasMore: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  onRetryFatal: () => void;
  onRetryRefresh: () => void;
  onRetryMore: () => void;
  onLikePress?: (postId: string) => void;
}

export function FeedScreenView({
  posts,
  isInitialLoading,
  isRefreshing,
  isLoadingMore,
  isEmptyFatalError,
  isRefreshError,
  isMoreError,
  hasMore,
  onRefresh,
  onEndReached,
  onRetryFatal,
  onRetryRefresh,
  onRetryMore,
  onLikePress,
}: FeedScreenViewProps) {

  const renderItem: ListRenderItem<Post> = useCallback(
    ({ item }) => <PostCard post={item} onLikePress={onLikePress} />,
    [onLikePress]
  );

  if (isEmptyFatalError && !isInitialLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FeedFatalError isRetrying={isInitialLoading} onRetry={onRetryFatal} />
      </SafeAreaView>
    );
  }

  if (isInitialLoading && posts.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]} edges={['top']}>
        <ActivityIndicator size="large" color={feedColors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        removeClippedSubviews={false}
        windowSize={7}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={50}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={feedColors.primary} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.35}
        ListHeaderComponent={
          isRefreshError ? (
            <FeedRefreshErrorBanner isRetrying={isRefreshing} onRetry={onRetryRefresh} />
          ) : null
        }
        ListFooterComponent={
          <FeedListFooter
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            isMoreError={isMoreError}
            isRetrying={isLoadingMore}
            onRetryMore={onRetryMore}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: feedColors.screenBg,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
});
