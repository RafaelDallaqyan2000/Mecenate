import { makeAutoObservable } from 'mobx';

import { UiStore } from './ui-store';

export class RootStore {
  appVersion = 1;
  ui: UiStore;

  constructor() {
    this.ui = new UiStore();
    makeAutoObservable(this, { ui: false });
  }
}

export const rootStore = new RootStore();
