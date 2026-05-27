import { useQuery } from '@tanstack/react-query';
import { getHistorialPedido, type HistorialEstado } from '../services/pedidos';
import LoadingSpinner from './ui/LoadingSpinner';

const estadoIconos: Record<string, string> = {
  pendiente: '🕐',
  confirmado: '✅',
  en_prep: '🔥',
  en_camino: '🚚',
  entregado: '📦',
  cancelado: '❌',
};

const estadoColores: Record<string, string> = {
  pendiente: 'border-yellow-500/30 text-yellow-400',
  confirmado: 'border-blue-500/30 text-blue-400',
  en_prep: 'border-purple-500/30 text-purple-400',
  en_camino: 'border-orange-500/30 text-orange-400',
  entregado: 'border-green-500/30 text-green-400',
  cancelado: 'border-red-500/30 text-red-400',
};

const estadoBg: Record<string, string> = {
  pendiente: 'bg-yellow-500/15',
  confirmado: 'bg-blue-500/15',
  en_prep: 'bg-purple-500/15',
  en_camino: 'bg-orange-500/15',
  entregado: 'bg-green-500/15',
  cancelado: 'bg-red-500/15',
};

const estadoLabels: Record<string, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  en_prep: 'En Preparación',
  en_camino: 'En Camino',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

interface Props {
  pedidoId: number;
  compact?: boolean;
}

export default function EstadoTimeline({ pedidoId, compact = false }: Props) {
  const { data: historial, isLoading } = useQuery({
    queryKey: ['historial', pedidoId],
    queryFn: () => getHistorialPedido(pedidoId),
  });

  if (isLoading) return <LoadingSpinner size="sm" />;

  if (!historial || historial.length === 0) return null;

  if (compact) {
    const ultimo = historial[historial.length - 1];
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${estadoColores[ultimo.estado_nuevo] ?? 'border-white/10 text-gray-400 bg-white/5'}`}>
        <span>{estadoIconos[ultimo.estado_nuevo] ?? '📋'}</span>
        <span>{estadoLabels[ultimo.estado_nuevo] ?? ultimo.estado_nuevo}</span>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
        <span>📜</span> Línea de tiempo
      </h4>
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-4 top-1 bottom-1 w-px bg-white/10" />

        <div className="space-y-4">
          {historial.map((item, idx) => (
            <div key={item.id} className="flex items-start gap-4 relative">
              {/* Círculo en la línea */}
              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm flex-shrink-0 ${
                estadoBg[item.estado_nuevo] ?? 'bg-white/5'
              } border-2 ${
                idx === historial.length - 1
                  ? 'border-amber-400 ring-2 ring-amber-400/20'
                  : 'border-white/10'
              }`}>
                <span>{estadoIconos[item.estado_nuevo] ?? '📋'}</span>
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-semibold text-sm ${
                    idx === historial.length - 1 ? 'text-amber-400' : 'text-gray-300'
                  }`}>
                    {estadoLabels[item.estado_nuevo] ?? item.estado_nuevo}
                  </span>
                  {idx === historial.length - 1 && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                      Actual
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(item.created_at).toLocaleString('es-AR')}
                </p>
                {item.estado_anterior && (
                  <p className="text-xs text-gray-500">
                    Desde: {estadoLabels[item.estado_anterior] ?? item.estado_anterior}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
