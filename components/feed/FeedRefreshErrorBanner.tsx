import { StyleSheet, Text, View } from 'react-native';

import { feedColors } from '@/components/feed/feedTheme';
import { AppButton } from '@/components/ui/AppButton';

export interface FeedRefreshErrorBannerProps {
  isRetrying: boolean;
  onRetry: () => void;
}

export function FeedRefreshErrorBanner({ isRetrying, onRetry }: FeedRefreshErrorBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>Не удалось загрузить публикации</Text>
      <AppButton title="Повторить" onPress={onRetry} loading={isRetrying} disabled={isRetrying} />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: feedColors.cardBg,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  text: {
    fontSize: 14,
    color: feedColors.textPrimary,
  },
});
