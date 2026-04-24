import { palette, surface, text } from '@/tokens/colors';
import { fontFamily } from '@/tokens/typography';

export const feedColors = {
  screenBg: surface.screen,
  screenBgLight: surface.screenLight,
  cardBg: surface.card,
  capsuleBg: surface.capsule,
  textPrimary: text.primary,
  textSecondary: text.secondary,
  textLightGray: text.lightGray,
  placeholder: text.placeholder,
  primary: palette.accent,
  primaryPressed: palette.accentPressed,
  primaryDisabled: palette.accentMuted,
  focusRing: palette.focusRing,
};

export const feedFonts = fontFamily;
