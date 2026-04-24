export type PostTier = 'free' | 'paid';

export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  subscribersCount?: number;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  author: Author;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: PostTier;
  createdAt: string;
}

export interface PostsPage {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type FeedTierFilter = 'all' | 'free' | 'paid';

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
}

export type CommentsSortMode = 'default' | 'new' | 'popular';

export interface CommentsPage {
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
}
