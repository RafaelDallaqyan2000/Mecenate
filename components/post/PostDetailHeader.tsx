import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { feedColors, feedFonts } from '@/components/feed/feedTheme';
import { CommentIcon } from '@/components/icons';
import { LikeButton } from '@/components/ui/LikeButton';
import type { Post } from '@/types/feed';

export interface PostDetailHeaderProps {
  post: Post;
  onLikePress: () => void;
  onBackPress?: () => void;
}

export function PostDetailHeader({ post, onLikePress, onBackPress }: PostDetailHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.authorRow}>

        <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} contentFit="cover" />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName} numberOfLines={1}>
            {post.author.displayName}
          </Text>
        </View>
      </View>

      {post.coverUrl ? (
        <Image source={{ uri: post.coverUrl }} style={styles.cover} contentFit="cover" />
      ) : null}

      <View style={styles.body}>
        <Text style={styles.title}>{post.title}</Text>
        {post.body ? <Text style={styles.text}>{post.body}</Text> : null}

        <View style={styles.meta}>
          <LikeButton liked={post.isLiked} count={post.likesCount} onPress={onLikePress} />
          <View style={styles.capsule}>
            <CommentIcon width={15} height={14} color={feedColors.textSecondary} />
            <Text style={styles.capsuleText}>{post.commentsCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: feedColors.cardBg,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  authorInfo: {
    flex: 1,
    gap: 2,
  },
  authorName: {
    fontFamily: feedFonts.title,
    fontSize: 15,
    fontWeight: '700',
    color: feedColors.textPrimary,
  },
  authorHandle: {
    fontFamily: feedFonts.bodyMedium,
    fontSize: 13,
    color: feedColors.textSecondary,
  },
  cover: {
    width: '100%',
    height: 393,
    backgroundColor: feedColors.capsuleBg,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  title: {
    fontFamily: feedFonts.title,
    fontSize: 22,
    lineHeight: 30,
    color: feedColors.textPrimary,
  },
  text: {
    fontFamily: feedFonts.bodyMedium,
    fontSize: 15,
    lineHeight: 22,
    color: feedColors.textPrimary,
  },
  meta: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: feedColors.capsuleBg,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    minWidth: 63,
    justifyContent: 'center',
  },
  capsuleText: {
    fontFamily: feedFonts.title,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    color: feedColors.textSecondary,
  },
});
