import type { WsEvent, WsStatus } from '@/types/realtime';

export interface WebSocketClientOptions {
  url: string;
  onEvent: (event: WsEvent) => void;
  onStatusChange?: (status: WsStatus) => void;
  minBackoffMs?: number;
  maxBackoffMs?: number;
}

function parseEvent(raw: string): WsEvent | null {
  try {
    const parsed = JSON.parse(raw) as { type?: string } & Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object' || typeof parsed.type !== 'string') {
      return null;
    }
    switch (parsed.type) {
      case 'ping':
        return { type: 'ping' };
      case 'like_updated':
        if (typeof parsed.postId === 'string' && typeof parsed.likesCount === 'number') {
          return {
            type: 'like_updated',
            postId: parsed.postId,
            likesCount: parsed.likesCount,
          };
        }
        return null;
      case 'comment_added':
        if (typeof parsed.postId === 'string' && parsed.comment && typeof parsed.comment === 'object') {
          return {
            type: 'comment_added',
            postId: parsed.postId,
            comment: parsed.comment as WsEvent extends { type: 'comment_added'; comment: infer C } ? C : never,
          };
        }
        return null;
      default:
        return null;
    }
  } catch {
    return null;
  }
}

export interface WebSocketClientHandle {
  start: () => void;
  stop: () => void;
  isActive: () => boolean;
}

export function createWebSocketClient(options: WebSocketClientOptions): WebSocketClientHandle {
  const minBackoff = options.minBackoffMs ?? 1_000;
  const maxBackoff = options.maxBackoffMs ?? 30_000;

  let socket: WebSocket | null = null;
  let manuallyStopped = true;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let currentBackoff = minBackoff;

  function setStatus(status: WsStatus) {
    options.onStatusChange?.(status);
  }

  function clearReconnectTimer() {
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function scheduleReconnect() {
    if (manuallyStopped) return;
    clearReconnectTimer();
    const delay = currentBackoff;
    currentBackoff = Math.min(maxBackoff, currentBackoff * 2);
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, delay);
  }

  function connect() {
    if (manuallyStopped) return;
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      return;
    }
    setStatus('connecting');
    try {
      socket = new WebSocket(options.url);
    } catch {
      socket = null;
      scheduleReconnect();
      return;
    }

    socket.onopen = () => {
      currentBackoff = minBackoff;
      setStatus('open');
    };

    socket.onmessage = (ev: WebSocketMessageEvent) => {
      if (typeof ev.data !== 'string') return;
      const parsed = parseEvent(ev.data);
      if (parsed) {
        options.onEvent(parsed);
      }
    };

    socket.onerror = () => {
    };

    socket.onclose = () => {
      socket = null;
      setStatus('closed');
      scheduleReconnect();
    };
  }

  function start() {
    if (!manuallyStopped) return;
    manuallyStopped = false;
    currentBackoff = minBackoff;
    connect();
  }

  function stop() {
    manuallyStopped = true;
    clearReconnectTimer();
    if (socket) {
      try {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.close();
      } catch {
      }
      socket = null;
    }
    setStatus('closed');
  }

  function isActive() {
    return !manuallyStopped;
  }

  return { start, stop, isActive };
}
