import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { feedColors } from '@/components/feed/feedTheme';
import { AppButton } from '@/components/ui/AppButton';

export interface FeedListFooterProps {
  isLoadingMore: boolean;
  hasMore: boolean;
  isMoreError: boolean;
  isRetrying: boolean;
  onRetryMore: () => void;
}

export function FeedListFooter({
  isLoadingMore,
  hasMore,
  isMoreError,
  isRetrying,
  onRetryMore,
}: FeedListFooterProps) {
  if (isMoreError) {
    return (
      <View style={styles.footer}>
        <Text style={styles.errorText}>Не удалось загрузить публикации</Text>
        <AppButton
          title="Повторить"
          onPress={onRetryMore}
          loading={isRetrying}
          disabled={isRetrying}
          minWidth={160}
          style={styles.retryAlign}
        />
      </View>
    );
  }
  if (isLoadingMore && hasMore) {
    return (
      <View style={styles.spinnerWrap}>
        <ActivityIndicator color={feedColors.primary} />
      </View>
    );
  }
  return <View style={styles.spacer} />;
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: feedColors.textPrimary,
    textAlign: 'center',
  },
  retryAlign: {
    alignSelf: 'center',
  },
  spinnerWrap: {
    paddingVertical: 16,
  },
  spacer: {
    height: 8,
  },
});
