import { observer } from 'mobx-react-lite';

import { FeedScreenView } from '@/components/feed/FeedScreenView';
import { useFeedPosts } from '@/hooks/useFeedPosts';
import { useTriggerHaptic } from '@/hooks/useTriggerHaptic';
import { useUiStore } from '@/stores';

function HomeScreenComponent() {
  const ui = useUiStore();
  const triggerHaptic = useTriggerHaptic();

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
  } = useFeedPosts({ tier: ui.feedTier });

  const handleTierChange = (next: typeof ui.feedTier) => {
    if (next === ui.feedTier) return;
    triggerHaptic();
    ui.setFeedTier(next);
  };

  return (
    <FeedScreenView
      posts={posts}
      tier={ui.feedTier}
      onTierChange={handleTierChange}
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

export default observer(HomeScreenComponent);
