import { makeAutoObservable } from 'mobx';

import type { CommentsSortMode, FeedTierFilter } from '@/types/feed';

export class UiStore {
  feedTier: FeedTierFilter = 'all';
  commentsSort: CommentsSortMode = 'new';

  constructor() {
    makeAutoObservable(this);
  }

  setFeedTier = (next: FeedTierFilter) => {
    this.feedTier = next;
  };

  setCommentsSort = (next: CommentsSortMode) => {
    this.commentsSort = next;
  };
}
