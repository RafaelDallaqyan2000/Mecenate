import { createContext, useContext, type ReactNode } from 'react';

import { rootStore, RootStore } from './root-store';

const StoreContext = createContext<RootStore | null>(null);

export interface StoreProviderProps {
  store?: RootStore;
  children: ReactNode;
}

export function StoreProvider({ store = rootStore, children }: StoreProviderProps) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useRootStore(): RootStore {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useRootStore must be used within StoreProvider');
  }
  return store;
}

export function useUiStore() {
  return useRootStore().ui;
}
