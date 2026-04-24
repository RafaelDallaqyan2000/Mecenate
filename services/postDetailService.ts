import { apiGetJson } from '@/lib/api/httpClient';
import type { Post } from '@/types/feed';

interface PostDetailResponsePayload {
  ok: boolean;
  data?: {
    post: Post;
  };
}

export async function fetchPostDetail(postId: string): Promise<Post> {
  const path = `posts/${encodeURIComponent(postId)}`;
  const json = await apiGetJson<PostDetailResponsePayload>(path);
  if (!json.ok || !json.data) {
    throw new Error('Bad post detail response');
  }
  return json.data.post;
}
