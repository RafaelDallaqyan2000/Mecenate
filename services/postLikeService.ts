import { apiPostJson } from '@/lib/api/httpClient';

export interface LikeToggleResult {
  isLiked: boolean;
  likesCount: number;
}

interface LikeResponsePayload {
  ok: boolean;
  data?: LikeToggleResult;
}

export async function togglePostLike(postId: string): Promise<LikeToggleResult> {
  const path = `posts/${encodeURIComponent(postId)}/like`;
  const json = await apiPostJson<LikeResponsePayload>(path);
  if (!json.ok || !json.data) {
    throw new Error('Bad like response');
  }
  return json.data;
}
