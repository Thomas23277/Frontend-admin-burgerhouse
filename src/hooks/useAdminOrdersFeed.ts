import { useEffect, useState, useCallback } from 'react';
import { wsService } from '../services/websocketService';

interface PedidoEstadoEvent {
  id: number;
  estado: string;
}

interface NuevoPedidoEvent {
  id: number;
  usuario_id: number;
  total: number;
}

export interface AdminOrderEvent {
  type: 'pedido_estado' | 'nuevo_pedido';
  data: PedidoEstadoEvent | NuevoPedidoEvent;
}

interface UseAdminOrdersFeedResult {
  /** Último evento recibido */
  lastEvent: AdminOrderEvent | null;
  /** Historial de eventos (máximo 100) */
  events: AdminOrderEvent[];
  /** Conectado al WS? */
  connected: boolean;
  /** Limpiar historial */
  clearEvents: () => void;
}

/**
 * Hook especializado para que el panel admin reciba
 * actualizaciones en tiempo real de pedidos.
 *
 * Escucha mensajes:
 * - `pedido_estado`: cambio de estado de un pedido
 * - `nuevo_pedido`: un cliente acaba de crear un pedido
 *
 * @example
 * ```tsx
 * const { lastEvent, connected } = useAdminOrdersFeed();
 * useEffect(() => {
 *   if (lastEvent?.type === 'nuevo_pedido') {
 *     // Mostrar notificación o refrescar lista
 *   }
 * }, [lastEvent]);
 * ```
 */
export function useAdminOrdersFeed(): UseAdminOrdersFeedResult {
  const [lastEvent, setLastEvent] = useState<AdminOrderEvent | null>(null);
  const [events, setEvents] = useState<AdminOrderEvent[]>([]);
  const [connected, setConnected] = useState(false);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setLastEvent(null);
  }, []);

  useEffect(() => {
    const unsubConnected = wsService.onConnectionChange(setConnected);

    const unsub = wsService.subscribe((msg: unknown) => {
      const data = msg as { type?: string; data?: unknown };

      if (data?.type === 'pedido_estado' || data?.type === 'nuevo_pedido') {
        const event: AdminOrderEvent = {
          type: data.type as 'pedido_estado' | 'nuevo_pedido',
          data: data.data as PedidoEstadoEvent | NuevoPedidoEvent,
        };
        setLastEvent(event);
        setEvents((prev) => {
          const next = [...prev, event];
          // Mantener máx 100 eventos
          return next.length > 100 ? next.slice(-100) : next;
        });
      }
    });

    return () => {
      unsub();
      unsubConnected();
    };
  }, []);

  return { lastEvent, events, connected, clearEvents };
}
