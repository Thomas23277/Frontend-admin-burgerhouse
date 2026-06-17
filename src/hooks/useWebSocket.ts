import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { wsService } from '../services/websocketService';

type MessageHandler = (data: unknown) => void;

interface UseWebSocketOptions {
  onMessage?: MessageHandler;
  autoConnect?: boolean;
}

/**
 * Hook WebSocket — wrapper alrededor del singleton wsService.
 */
export function useWebSocket({
  onMessage,
  autoConnect = true,
}: UseWebSocketOptions = {}) {
  const { user, isAuthenticated } = useAuth();
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!onMessage) return;
    const wrapper = (data: unknown) => onMessageRef.current?.(data);
    const unsub = wsService.subscribe(wrapper);
    return unsub;
  }, []);

  useEffect(() => {
    if (!autoConnect) return;

    if (isAuthenticated && user) {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1];
      if (token) {
        wsService.connect(token);
      }
    } else {
      wsService.disconnect();
    }
  }, [isAuthenticated, user, autoConnect]);

  const send = useCallback((data: unknown) => wsService.send(data), []);
  const disconnect = useCallback(() => wsService.disconnect(), []);

  return { send, disconnect };
}
