import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { queryClient } from '@/lib/query-client';
import { RealtimeProvider } from '@/providers/RealtimeProvider';
import { StoreProvider } from '@/stores';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        <RealtimeProvider>{children}</RealtimeProvider>
      </QueryClientProvider>
    </StoreProvider>
  );
}
