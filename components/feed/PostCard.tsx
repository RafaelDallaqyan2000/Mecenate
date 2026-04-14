import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PaidPostStub } from '@/components/feed/PaidPostStub';
import { feedColors, feedFonts } from '@/components/feed/feedTheme';
import { LikeButton } from '@/components/ui/LikeButton';
import { ExpandableDescription } from '@/components/ui/ExpandableDescription';
import type { Post } from '@/types/feed';
import { CommentIcon } from '../icons';

export interface PostCardProps {
  post: Post;
  onLikePress?: (postId: string) => void;
}

function PostCardComponent({ post, onLikePress }: PostCardProps) {
  const isPaid = post.tier === 'paid';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} contentFit="cover" />
        <Text style={styles.authorName} numberOfLines={1}>
          {post.author.displayName}
        </Text>
      </View>
      {isPaid ? (
        <PaidPostStub coverUrl={post.coverUrl} />
      ) : (
        <Image source={{ uri: post.coverUrl }} style={styles.cover} contentFit="cover" />
      )}
      {isPaid ? (
        <View style={[styles.body, styles.bodyPaid]}>
          <View style={styles.skeletonShort} />
          <View style={styles.skeletonLong} />
        </View>
      ) : (
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {post.title}
          </Text>
          <ExpandableDescription
            text={post.preview}
            expandedText={post.body}
            textStyle={styles.previewText}
            lineHeight={20}
            fadeColor={feedColors.cardBg}
            linkColor={feedColors.primary}
            containerStyle={styles.previewContainer}
          />
          <View style={styles.footer}>
            <LikeButton
              liked={post.isLiked}
              count={post.likesCount}
              onPress={() => onLikePress?.(post.id)}
            />
            <View style={styles.capsule}>
              <CommentIcon width={15} height={14} color={feedColors.textSecondary} />
              <Text style={styles.capsuleText}>{post.commentsCount}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

export const PostCard = memo(PostCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: feedColors.cardBg,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  authorName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: feedColors.textPrimary,
  },
  cover: {
    width: '100%',
    height: 393,
    backgroundColor: feedColors.capsuleBg,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  bodyPaid: {
    gap: 8,
  },
  skeletonShort: {
    height: 26,
    width: '45%',
    alignSelf: 'flex-start',
    backgroundColor: '#E8EAED',
    borderRadius: 22,
  },
  skeletonLong: {
    height: 40,
    width: '100%',
    backgroundColor: '#E8EAED',
    borderRadius: 22,
  },
  title: {
    fontFamily: feedFonts.title,
    fontSize: 18,
    lineHeight: 26,
    color: feedColors.textPrimary,
    marginBottom: 8,
  },
  previewContainer: {
    marginBottom: 12,
  },
  previewText: {
    fontFamily: feedFonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
    color: feedColors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: feedColors.capsuleBg,
    paddingHorizontal: 9,
    paddingVertical: 9,
    borderRadius: 999,
  },
  capsuleText: {
    fontSize: 13,
    color: feedColors.textSecondary,
    fontWeight: '700',
    lineHeight: 18,
    letterSpacing: 0,
  },
});
