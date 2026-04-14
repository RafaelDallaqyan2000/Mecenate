import { like } from '@/tokens/colors';

export const likeTheme = {
  inactive: {
    backgroundDefault: like.inactiveBg,
    backgroundPressed: like.inactiveBgPressed,
    backgroundPressedDeep: like.inactiveBgPressedDeep,
    foreground: like.inactiveFg,
    foregroundDisabled: like.inactiveFgDisabled,
  },
  active: {
    backgroundDefault: like.activeBg,
    backgroundPressed: like.activeBgPressed,
    backgroundPressedDeep: like.activeBgPressedDeep,
    backgroundSoft: like.activeBgSoft,
    foreground: like.activeFg,
    foregroundOnSoft: like.activeFg,
  },
} as const;
