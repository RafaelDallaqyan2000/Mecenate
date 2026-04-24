import type { Comment } from '@/types/feed';

export type WsEvent =
  | { type: 'ping' }
  | { type: 'like_updated'; postId: string; likesCount: number }
  | { type: 'comment_added'; postId: string; comment: Comment };

export type WsStatus = 'idle' | 'connecting' | 'open' | 'closed';
