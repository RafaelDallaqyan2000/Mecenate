import { FeedScreenView } from '@/components/feed/FeedScreenView';
import { useFeedPosts } from '@/hooks/useFeedPosts';

export default function HomeScreen() {
  const {
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
  } = useFeedPosts();

  return (
    <FeedScreenView
      posts={posts}
      isInitialLoading={isInitialLoading}
      isRefreshing={isRefreshing}
      isLoadingMore={isLoadingMore}
      isEmptyFatalError={isEmptyFatalError}
      isRefreshError={isRefreshError}
      isMoreError={isMoreError}
      hasMore={hasMore}
      onRefresh={refresh}
      onEndReached={loadMore}
      onRetryFatal={retryFatal}
      onRetryRefresh={retryRefresh}
      onRetryMore={retryMore}
      onLikePress={onLikePress}
    />
  );
}
