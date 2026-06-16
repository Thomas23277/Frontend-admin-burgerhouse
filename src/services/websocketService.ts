/**
 * WebSocket Service — Singleton.
 *
 * Gestiona una única conexión WebSocket fuera del ciclo de vida de React.
 * No se ve afectado por StrictMode, re-renders, ni montaje/desmontaje de componentes.
 */
import { useWsStore } from '../store/wsStore';
import type { WsMessage } from '../store/wsStore';

type MessageHandler = (data: unknown) => void;

const WS_BASE = import.meta.env.VITE_WS_URL ?? `ws://${location.host}/ws`;

class WebSocketService {
  private ws: WebSocket | null = null;
  private retryDelay = 1_000;
  private maxRetryDelay = 30_000;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private stopped = false;
  private messageHandlers: Set<MessageHandler> = new Set();

  /** Conectar al WebSocket con un token JWT */
  connect(token: string): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    this.stopped = false;
    this._createConnection(token);
  }

  /** Desconectar y detener reconexiones */
  disconnect(): void {
    this.stopped = true;
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    this.ws?.close();
    this.ws = null;
    this.retryDelay = 1_000;
  }

  /** Enviar datos si la conexión está abierta */
  send(data: unknown): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  /** Registrar handler de mensajes. Devuelve función para desuscribirse. */
  subscribe(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  /** Suscribirse a cambios de conexión. Devuelve función para desuscribirse. */
  onConnectionChange(callback: (connected: boolean) => void): () => void {
    // Llamada inicial con estado actual
    callback(useWsStore.getState().connected);
    return useWsStore.subscribe((state) => {
      callback(state.connected);
    });
  }

  private _createConnection(token: string): void {
    const url = `${WS_BASE}?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(url);
    this.ws = ws;

    ws.onopen = () => {
      if (this.stopped || ws !== this.ws) {
        ws.close();
        return;
      }
      this.retryDelay = 1_000;
      useWsStore.getState().setConnected(true);
    };

    ws.onmessage = (event) => {
      let data: unknown;
      try {
        data = JSON.parse(event.data);
      } catch {
        data = event.data;
      }
      if (typeof data === 'object' && data !== null) {
        useWsStore.getState().pushMessage(data as WsMessage);
      }
      for (const handler of this.messageHandlers) {
        try { handler(data); } catch { /* ignorar */ }
      }
    };

    ws.onclose = () => {
      if (ws !== this.ws) return;
      this.ws = null;
      useWsStore.getState().setConnected(false);
      if (this.stopped) return;
      this.retryTimer = setTimeout(() => {
        if (!this.stopped) {
          const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('access_token='))
            ?.split('=')[1];
          if (token) this._createConnection(token);
        }
      }, this.retryDelay);
      this.retryDelay = Math.min(this.retryDelay * 2, this.maxRetryDelay);
    };

    ws.onerror = () => { ws.close(); };
  }
}

/** Singleton global */
export const wsService = new WebSocketService();
