import { Pressable, StyleSheet, Text, View } from 'react-native';

import { feedColors, feedFonts } from '@/components/feed/feedTheme';
import type { FeedTierFilter } from '@/types/feed';

export interface FeedTierTabsProps {
  value: FeedTierFilter;
  onChange: (next: FeedTierFilter) => void;
}

interface TabDescriptor {
  key: FeedTierFilter;
  label: string;
}

const TABS: TabDescriptor[] = [
  { key: 'all', label: 'Все' },
  { key: 'free', label: 'Бесплатные' },
  { key: 'paid', label: 'Платные' },
];

export function FeedTierTabs({ value, onChange }: FeedTierTabsProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.key === value;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(tab.key)}
            style={({ pressed }) => [
              styles.tab,
              isActive && styles.tabActive,
              pressed && !isActive && styles.tabPressed,
            ]}>
            <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: feedColors.capsuleBg,
    borderStyle: 'solid',
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: feedColors.cardBg,
  },

  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: feedColors.primary,
  },
  tabPressed: {
    opacity: 0.75,
  },
  label: {
    fontFamily: feedFonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: feedColors.textSecondary,
  },
  labelActive: {
    color: feedColors.cardBg,
    fontFamily: feedFonts.title,
  },
});
