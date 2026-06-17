import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '../hooks/useWebSocket';

/**
 * Escucha mensajes WebSocket globales e invalida queries del admin.
 * Se monta una sola vez en App.tsx.
 */
export default function WsInvalidator() {
  const queryClient = useQueryClient();

  useWebSocket({
    onMessage: (data) => {
      const msg = data as { type?: string; data?: { id?: number } };
      if (!msg.type) return;

      switch (msg.type) {
        // ── Pedidos ──────────────────────────────────────
        case 'pedido_estado':
        case 'nuevo_pedido':
          queryClient.invalidateQueries({ queryKey: ['pedidos'] });
          if (msg.data?.id) {
            queryClient.invalidateQueries({ queryKey: ['historial', msg.data.id] });
          }
          break;

        // ── Productos ────────────────────────────────────
        case 'producto_creado':
        case 'producto_actualizado':
        case 'producto_eliminado':
          queryClient.invalidateQueries({ queryKey: ['productos'] });
          if (msg.data?.id) {
            queryClient.invalidateQueries({ queryKey: ['producto', msg.data.id] });
          }
          break;

        // ── Categorías ───────────────────────────────────
        case 'categoria_creada':
        case 'categoria_actualizada':
        case 'categoria_eliminada':
          queryClient.invalidateQueries({ queryKey: ['categorias'] });
          queryClient.invalidateQueries({ queryKey: ['productos'] });
          break;

        // ── Usuarios ──────────────────────────────────────
        case 'usuario_rol_actualizado':
          queryClient.invalidateQueries({ queryKey: ['usuarios'] });
          break;

        default:
          break;
      }
    },
  });

  return null;
}
