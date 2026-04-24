import { apiGetJson, apiPostJson } from '@/lib/api/httpClient';
import type { Comment, CommentsPage } from '@/types/feed';

const COMMENTS_PAGE_SIZE = 20;

interface CommentsResponsePayload {
  ok: boolean;
  data?: {
    comments: Comment[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

interface CommentCreatedResponsePayload {
  ok: boolean;
  data?: { comment: Comment };
}

export async function fetchCommentsPage(
  postId: string,
  cursor?: string
): Promise<CommentsPage> {
  const path = `posts/${encodeURIComponent(postId)}/comments`;
  const json = await apiGetJson<CommentsResponsePayload>(path, {
    limit: COMMENTS_PAGE_SIZE,
    cursor: cursor || undefined,
  });
  if (!json.ok || !json.data) {
    throw new Error('Bad comments response');
  }
  return {
    comments: json.data.comments,
    nextCursor: json.data.nextCursor,
    hasMore: json.data.hasMore,
  };
}

export async function addComment(postId: string, text: string): Promise<Comment> {
  const path = `posts/${encodeURIComponent(postId)}/comments`;
  const json = await apiPostJson<CommentCreatedResponsePayload>(path, { text });
  if (!json.ok || !json.data) {
    throw new Error('Bad addComment response');
  }
  return json.data.comment;
}
