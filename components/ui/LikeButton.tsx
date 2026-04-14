import { Pressable, StyleSheet, Text, View } from 'react-native';

import { feedFonts } from '@/components/feed/feedTheme';
import { HeartIcon } from '@/components/icons/HeartIcon';
import { likeTheme } from '@/constants/likeTheme';

export interface LikeButtonProps {
  liked: boolean;
  count: number;
  onPress: () => void;
  disabled?: boolean;
}

function resolveBackground(liked: boolean, pressed: boolean, disabled: boolean): string {
  if (disabled) {
    return liked ? likeTheme.active.backgroundSoft : 'transparent';
  }
  if (liked) {
    return pressed ? likeTheme.active.backgroundPressed : likeTheme.active.backgroundDefault;
  }
  if (pressed) {
    return likeTheme.inactive.backgroundPressed;
  }
  return likeTheme.inactive.backgroundDefault;
}

function resolveForeground(liked: boolean, disabled: boolean): string {
  if (liked) {
    return likeTheme.active.foreground;
  }
  if (disabled) {
    return likeTheme.inactive.foregroundDisabled;
  }
  return likeTheme.inactive.foreground;
}

export function LikeButton({ liked, count, onPress, disabled = false }: LikeButtonProps) {
  const label = count > 999 ? '999+' : String(count);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: liked, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.hit,
        { backgroundColor: resolveBackground(liked, pressed, disabled) },
      ]}>
      <View style={styles.row}>
        <HeartIcon
          variant={liked ? 'solid' : 'outline'}
          width={16}
          height={15}
          color={resolveForeground(liked, disabled)}
        />
        <Text style={[styles.count, { color: resolveForeground(liked, disabled) }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  count: {
    fontFamily: feedFonts.bodyMedium,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    minWidth: 18,
  },
});
