import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, type ReactNode } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { WS_URL } from '@/constants/apiConfig';
import { useRealtimeCacheSync } from '@/hooks/useRealtimeCacheSync';
import { createWebSocketClient, type WebSocketClientHandle } from '@/lib/ws/websocketClient';

export interface RealtimeProviderProps {
  children: ReactNode;
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const qc = useQueryClient();
  const handleEvent = useRealtimeCacheSync(qc);
  const clientRef = useRef<WebSocketClientHandle | null>(null);

  useEffect(() => {
    if (!WS_URL) {
      return;
    }

    const client = createWebSocketClient({
      url: WS_URL,
      onEvent: handleEvent,
    });
    clientRef.current = client;
    client.start();

    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (!clientRef.current) return;
      if (next === 'active') {
        clientRef.current.start();
      } else {
        clientRef.current.stop();
      }
    });

    return () => {
      sub.remove();
      client.stop();
      clientRef.current = null;
    };
  }, [handleEvent]);

  return <>{children}</>;
}
