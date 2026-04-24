import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';

import { feedColors, feedFonts } from '@/components/feed/feedTheme';
import type { CommentsSortMode } from '@/types/feed';

export interface CommentsSortSelectorProps {
  value: CommentsSortMode;
  onChange: (next: CommentsSortMode) => void;
}

interface Option {
  key: CommentsSortMode;
  label: string;
}

const OPTIONS: Option[] = [
  { key: 'new', label: 'Сначала новые' },
  { key: 'popular', label: 'Популярные' },
  { key: 'default', label: 'По умолчанию' },
];

function labelFor(mode: CommentsSortMode): string {
  return OPTIONS.find((o) => o.key === mode)?.label ?? OPTIONS[0].label;
}

export function CommentsSortSelector({ value, onChange }: CommentsSortSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (next: CommentsSortMode) => {
    setOpen(false);
    onChange(next);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Сортировка комментариев"
        onPress={() => setOpen(true)}
        hitSlop={8}>
        <Text style={styles.triggerText}>{labelFor(value)}</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            {OPTIONS.map((opt) => {
              const active = opt.key === value;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => handleSelect(opt.key)}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && styles.optionPressed,
                  ]}>
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  triggerText: {
    fontFamily: feedFonts.titleMedium,
    fontSize: 15,
    color: feedColors.primary,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,20,22,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: feedColors.cardBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
    paddingBottom: 24,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionPressed: {
    backgroundColor: feedColors.capsuleBg,
  },
  optionText: {
    fontFamily: feedFonts.bodyMedium,
    fontSize: 16,
    color: feedColors.textPrimary,
  },
  optionTextActive: {
    fontFamily: feedFonts.title,
    fontWeight: '700',
    color: feedColors.primary,
  },
});
