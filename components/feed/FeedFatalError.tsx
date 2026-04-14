import { StyleSheet, Text, View } from 'react-native';

import { feedColors } from '@/components/feed/feedTheme';
import { AppButton } from '@/components/ui/AppButton';

export interface FeedFatalErrorProps {
  isRetrying: boolean;
  onRetry: () => void;
}

export function FeedFatalError({ isRetrying, onRetry }: FeedFatalErrorProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.message}>Не удалось загрузить публикации</Text>
      <AppButton
        title="Повторить"
        onPress={onRetry}
        loading={isRetrying}
        disabled={isRetrying}
        minWidth={200}
        accessibilityLabel="Повторить загрузку"
        style={styles.buttonAlign}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: feedColors.screenBg,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: feedColors.textPrimary,
    marginBottom: 20,
  },
  buttonAlign: {
    alignSelf: 'center',
  },
});
