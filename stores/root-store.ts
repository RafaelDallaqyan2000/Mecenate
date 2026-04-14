import { makeAutoObservable } from 'mobx';

export class RootStore {
  appVersion = 1;

  constructor() {
    makeAutoObservable(this);
  }
}

export const rootStore = new RootStore();
