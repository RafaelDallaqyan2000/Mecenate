import { StyleSheet, Text, View } from 'react-native';

import { CommentsSortSelector } from '@/components/comments/CommentsSortSelector';
import { feedColors, feedFonts } from '@/components/feed/feedTheme';
import type { CommentsSortMode } from '@/types/feed';

export interface CommentsSectionHeaderProps {
  count: number;
  sort: CommentsSortMode;
  onSortChange: (next: CommentsSortMode) => void;
}

function pluralize(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'комментарий';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'комментария';
  return 'комментариев';
}

export function CommentsSectionHeader({ count, sort, onSortChange }: CommentsSectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.count}>
        {count} {pluralize(count)}
      </Text>
      <CommentsSortSelector value={sort} onChange={onSortChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: feedColors.cardBg,
  },
  count: {
    fontFamily: feedFonts.titleMedium,
    fontSize: 15,
    color: feedColors.textLightGray,
  },
});
