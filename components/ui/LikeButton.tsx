import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { feedColors, feedFonts } from '@/components/feed/feedTheme';
import { HeartIcon } from '@/components/icons/HeartIcon';
import { likeTheme } from '@/constants/likeTheme';

export interface LikeButtonProps {
  liked: boolean;
  count: number;
  onPress: () => void;
  disabled?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

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

function formatCount(count: number): string {
  return count > 999 ? '999+' : String(count);
}

function triggerHaptic() {
  if (Platform.OS === 'web') return;
  void Haptics.selectionAsync();
}

export function LikeButton({ liked, count, onPress, disabled = false }: LikeButtonProps) {
  const label = formatCount(count);
  const scale = useSharedValue(1);
  const countTranslate = useSharedValue(0);
  const countOpacity = useSharedValue(1);

  useEffect(() => {
    countOpacity.value = withSequence(
      withTiming(0, { duration: 90, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 160, easing: Easing.out(Easing.ease) })
    );
    countTranslate.value = withSequence(
      withTiming(-6, { duration: 90, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 160, easing: Easing.out(Easing.ease) })
    );
  }, [count, countOpacity, countTranslate]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const countStyle = useAnimatedStyle(() => ({
    opacity: countOpacity.value,
    transform: [{ translateY: countTranslate.value }],
  }));

  const handlePress = () => {
    if (disabled) return;
    scale.value = withSequence(
      withTiming(1.25, { duration: 110, easing: Easing.out(Easing.ease) }),
      withTiming(0.92, { duration: 80, easing: Easing.in(Easing.ease) }),
      withTiming(1, { duration: 120, easing: Easing.out(Easing.ease) }, () => {
        runOnJS(triggerHaptic)();
      })
    );
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: liked, disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.hit,
        { backgroundColor: resolveBackground(liked, pressed, disabled) },
      ]}>
      <View style={styles.row}>
        <AnimatedView style={iconStyle}>
          <HeartIcon
            variant={liked ? 'solid' : 'outline'}
            width={16}
            height={15}
            color={resolveForeground(liked, disabled)}
          />
        </AnimatedView>
        <Animated.Text
          style={[styles.count, { color: resolveForeground(liked, disabled) }, countStyle]}>
          {label}
        </Animated.Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignSelf: 'flex-start',
    minWidth: 63,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  count: {
    fontFamily: feedFonts.title,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    minWidth: 18,
    color: feedColors.textSecondary,
  },
});
