import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { feedColors, feedFonts } from '@/components/feed/feedTheme';
import { HeartIcon } from '@/components/icons/HeartIcon';
import { like as likeTokens } from '@/tokens/colors';
import type { Comment } from '@/types/feed';

export interface CommentItemProps {
  comment: Comment;
}

function CommentItemComponent({ comment }: CommentItemProps) {
  const liked = comment.isLiked ?? false;
  const likesCount = comment.likesCount ?? 0;
console.log(comment, '<<');

  return (
    <View style={styles.row}>
      <Image
        source={{ uri: comment.author.avatarUrl }}
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {comment.author.displayName}
        </Text>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
      <View style={styles.likeSlot} accessibilityElementsHidden importantForAccessibility="no">
        <HeartIcon
          variant={liked ? 'solid' : 'outline'}
          width={18}
          height={16}
          color={liked ? likeTokens.activeBg : likeTokens.inactiveFg}
        />
        <Text style={styles.likeCount}>{likesCount}</Text>
      </View>
    </View>
  );
}

export const CommentItem = memo(CommentItemComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
    backgroundColor: feedColors.cardBg,
    alignItems: 'center',

  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: feedColors.capsuleBg,
  },
  body: {
    flex: 1,
    gap: 2,
    paddingTop: 2,
  },
  name: {
    fontFamily: feedFonts.title,
    fontSize: 15,
    fontWeight: '700',
    color: feedColors.textPrimary,
  },
  text: {
    fontFamily: feedFonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: feedColors.textPrimary,
  },
  likeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  likeCount: {
    fontFamily: feedFonts.title,
    fontSize: 13,
    fontWeight: '700',
    color: feedColors.textSecondary,
    minWidth: 14,
    textAlign: 'left',
  },
});
