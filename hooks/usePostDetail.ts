import { useQuery } from '@tanstack/react-query';

import { postDetailQueryKey } from '@/hooks/feed-query-keys';
import { fetchPostDetail } from '@/services/postDetailService';
import type { Post } from '@/types/feed';

export interface UsePostDetailResult {
  post: Post | undefined;
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  refetch: () => void;
}

export function usePostDetail(postId: string | undefined): UsePostDetailResult {
  const query = useQuery({
    queryKey: postId ? postDetailQueryKey(postId) : ['post', 'empty'],
    queryFn: () => {
      if (!postId) {
        return Promise.reject(new Error('Missing post id'));
      }
      return fetchPostDetail(postId);
    },
    enabled: !!postId,
  });

  return {
    post: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    isRefetching: query.isRefetching,
    refetch: () => {
      void query.refetch();
    },
  };
}
