import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as pedidosService from '../services/pedidos';
import * as productosService from '../services/productos';
import * as usuariosService from '../services/usuarios';
import PedidoModal from '../components/modals/PedidoModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import EstadoTimeline from '../components/EstadoTimeline';
import type { Pedido, Producto, Usuario } from '../types';

const estadoColores: Record<string, string> = {
  pendiente: 'badge-yellow',
  confirmado: 'badge-blue',
  en_prep: 'badge-purple',
  en_camino: 'badge-orange',
  entregado: 'badge-green',
  cancelado: 'badge-red',
};

const estadoLabels: Record<string, string> = {
  pendiente: '⏳ Pendiente',
  confirmado: '✅ Confirmado',
  en_prep: '👨‍🍳 En preparación',
  en_camino: '🚚 En camino',
  entregado: '🎉 Entregado',
  cancelado: '❌ Cancelado',
};

const estadoBtns: Record<string, { label: string; next: string; color: string } | null> = {
  pendiente: { label: '✓ Confirmar', next: 'confirmado', color: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' },
  confirmado: { label: '🔥 En Preparación', next: 'en_prep', color: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20' },
  en_prep: { label: '🚚 En Camino', next: 'en_camino', color: 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' },
  en_camino: { label: '📦 Entregar', next: 'entregado', color: 'bg-green-500/10 text-green-400 hover:bg-green-500/20' },
  entregado: null,
  cancelado: null,
};

export default function Pedidos() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState<Record<number, boolean>>({});

  const { data: pedidos, isLoading } = useQuery({
    queryKey: ['pedidos'],
    queryFn: (): Promise<Pedido[]> => pedidosService.getPedidos(),
  });
  const { data: productos } = useQuery({
    queryKey: ['productos'],
    queryFn: (): Promise<Producto[]> => productosService.getProductos(),
  });
  const { data: usuarios } = useQuery({
    queryKey: ['usuarios'],
    queryFn: (): Promise<Usuario[]> => usuariosService.getUsuarios(),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => pedidosService.updatePedido(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pedidos'] }),
  });

  const createMut = useMutation({
    mutationFn: pedidosService.createPedido,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['pedidos'] }); setModalOpen(false); },
  });

  if (isLoading) return <LoadingSpinner text="Cargando pedidos..." />;

  return (
    <div className="min-h-screen">
      <div className="px-4 md:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-start mb-8 animate-fadeInUp">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                📋 Pedidos
              </span>
            </h1>
            <p className="text-gray-500 text-lg">Visualiza y gestiona los pedidos</p>
          </div>
          <button onClick={() => setModalOpen(true)}
            className="btn-primary text-base px-6 py-3">
            + Nuevo Pedido
          </button>
        </div>

        <div className="space-y-4 stagger">
          {pedidos?.length === 0 ? (
            <EmptyState icon="📋" title="No hay pedidos todavía" subtitle="Crea tu primer pedido para empezar" />
          ) : (
            pedidos?.map((pedido) => (
              <div key={pedido.id} className="card p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-xl text-white">Pedido #{pedido.id}</h3>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${estadoColores[pedido.estado] ?? 'badge-gray'}`}>
                        {estadoLabels[pedido.estado] || pedido.estado}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">{new Date(pedido.created_at).toLocaleString()}</p>
                    {pedido.usuario_nombre && (
                      <p className="text-gray-500 text-xs mt-0.5">Cliente: {pedido.usuario_nombre}</p>
                    )}
                  </div>
                  <p className="text-amber-400 font-black text-2xl md:text-3xl">${(pedido.total || 0).toLocaleString()}</p>
                </div>

                {/* Botones de estado */}
                <div className="flex flex-wrap gap-2">
                  {estadoBtns[pedido.estado] && (
                    <button
                      onClick={() => updateMut.mutate({ id: pedido.id, data: { estado: estadoBtns[pedido.estado]!.next } })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${estadoBtns[pedido.estado]!.color}`}
                    >
                      {estadoBtns[pedido.estado]!.label}
                    </button>
                  )}
                  {pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' && (
                    <button onClick={() => updateMut.mutate({ id: pedido.id, data: { estado: 'cancelado' } })}
                      className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition cursor-pointer">
                      ✕ Cancelar
                    </button>
                  )}
                </div>

                {/* Timeline toggle */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <button
                    onClick={() => setTimelineOpen((prev) => ({ ...prev, [pedido.id]: !prev[pedido.id] }))}
                    className="text-sm text-gray-500 hover:text-amber-400 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="transition-transform" style={{ transform: timelineOpen[pedido.id] ? 'rotate(90deg)' : '' }}>
                      ▶
                    </span>
                    <span>Ver historial de cambios</span>
                  </button>
                  {timelineOpen[pedido.id] && (
                    <div className="mt-3 pl-2">
                      <EstadoTimeline pedidoId={pedido.id} />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {modalOpen && productos && usuarios && (
          <PedidoModal productos={productos} usuarios={usuarios}
            onClose={() => setModalOpen(false)}
            onSave={(data) => createMut.mutate(data)} />
        )}
      </div>
    </div>
  );
}
