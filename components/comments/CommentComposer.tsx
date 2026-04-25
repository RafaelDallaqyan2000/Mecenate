import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import SendMessageIcon from '@/assets/icons/SendMessageIcon';
import { feedColors, feedFonts } from '@/components/feed/feedTheme';

const MIN_LENGTH = 1;
const MAX_LENGTH = 500;

export interface CommentComposerProps {
  onSubmit: (text: string) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function CommentComposer({ onSubmit, isSubmitting = false }: CommentComposerProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const trimmed = value.trim();
  const canSubmit =
    !isSubmitting && trimmed.length >= MIN_LENGTH && trimmed.length <= MAX_LENGTH;

  const handleSend = useCallback(async () => {
    if (!canSubmit) return;
    const text = trimmed;
    setValue('');
    try {
      await onSubmit(text);
    } catch {
      setValue(text);
    }
  }, [canSubmit, trimmed, onSubmit]);

  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Оставьте комментарий"
        placeholderTextColor={feedColors.textSecondary}
        style={[styles.input, isFocused && styles.inputFocused]}
        editable={!isSubmitting}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !canSubmit }}
        disabled={!canSubmit}
        onPress={handleSend}
        style={({ pressed }) => [
          styles.sendBtn,
          pressed && canSubmit && styles.sendBtnPressed,
        ]}>
        {isSubmitting ? (
          <ActivityIndicator size="small" color={feedColors.cardBg} />
        ) : (
          <SendMessageIcon color={!canSubmit ? feedColors.onPrimaryDisabled : feedColors.onPrimary} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 13,
    backgroundColor: feedColors.cardBg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: feedColors.capsuleBg,
  },
  input: {
    flex: 1,
    // height: 40,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: feedColors.capsuleBg,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 20,
    fontFamily: feedFonts.bodyMedium,
    fontSize: 14,
    color: feedColors.textPrimary,
    backgroundColor: feedColors.capsuleBg,
  },
  inputFocused: {
    borderColor: feedColors.primary,
    backgroundColor: feedColors.screenBgLight,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: feedColors.cardBg,
  },
  sendBtnPressed: {
    backgroundColor: feedColors.primaryPressed,
  },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 11,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: feedColors.cardBg,
    marginLeft: 2,
  },
});
