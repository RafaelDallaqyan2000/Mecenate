import { brandColors } from '@/constants/brand';
import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  minWidth?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}


export function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  minWidth,
  style,
  textStyle,
  accessibilityLabel,
}: AppButtonProps) {

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        minWidth != null && { minWidth },
        pressed && !disabled && styles.pressed,
        loading && styles.loading,
        disabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={brandColors.onPrimary} size="small" />
      ) : (
        <Text style={[styles.label, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    backgroundColor: brandColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  pressed: {
    backgroundColor: brandColors.primaryPressed,
  },
  disabled: {
    backgroundColor: brandColors.primaryDisabled,
  },
  loading: {
    backgroundColor: brandColors.primaryPressed,
  },
  label: {
    color: brandColors.onPrimary,
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 26,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
