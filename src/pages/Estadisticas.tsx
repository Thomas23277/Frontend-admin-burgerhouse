import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  getTotales,
  getPedidosPeriodo,
  getPlataformaMasVendida,
  getTicketPromedio,
  getRankingProductos,
  getPedidosPorEstado,
  getIngresos,
} from '../services/estadisticas';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ESTADO_COLORS: Record<string, string> = {
  pendiente: '#f59e0b',
  confirmado: '#3b82f6',
  en_prep: '#f97316',
  entregado: '#22c55e',
  cancelado: '#ef4444',
};

export default function Estadisticas() {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const totalesQ = useQuery({
    queryKey: ['estadisticas', 'totales'],
    queryFn: getTotales,
  });

  const periodoQ = useQuery({
    queryKey: ['estadisticas', 'periodo', desde, hasta],
    queryFn: () => getPedidosPeriodo(desde || undefined, hasta || undefined),
  });

  const plataformaQ = useQuery({
    queryKey: ['estadisticas', 'plataforma'],
    queryFn: getPlataformaMasVendida,
  });

  const ticketQ = useQuery({
    queryKey: ['estadisticas', 'ticket'],
    queryFn: getTicketPromedio,
  });

  const rankingQ = useQuery({
    queryKey: ['estadisticas', 'ranking'],
    queryFn: getRankingProductos,
  });

  const pedidosPorEstadoQ = useQuery({
    queryKey: ['estadisticas', 'pedidos-por-estado'],
    queryFn: getPedidosPorEstado,
  });

  const ingresosQ = useQuery({
    queryKey: ['estadisticas', 'ingresos'],
    queryFn: getIngresos,
  });

  const loading =
    totalesQ.isLoading ||
    periodoQ.isLoading ||
    plataformaQ.isLoading ||
    ticketQ.isLoading ||
    rankingQ.isLoading ||
    pedidosPorEstadoQ.isLoading ||
    ingresosQ.isLoading;

  const totales = totalesQ.data;

  return (
    <div className="min-h-screen">
      <div className="px-4 md:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              📊 Estadísticas
            </span>
          </h1>
          <p className="text-gray-500 text-lg">
            Panel de administración — métricas del negocio
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Cargando estadísticas..." />
        ) : (
          <div className="space-y-6 stagger">
            {/* Cards de totales */}
            {totales && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard label="Pedidos" value={totales.total_pedidos} icon="📦" />
                <StatCard label="Productos" value={totales.total_productos} icon="🍔" />
                <StatCard label="Clientes" value={totales.total_clientes} icon="👥" />
                <StatCard label="Ingredientes" value={totales.total_ingredientes} icon="🥬" />
                <StatCard label="Categorías" value={totales.total_categorias} icon="📁" />
              </div>
            )}

            {/* Producto más vendido */}
            {plataformaQ.data && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-2">
                  🏆 Producto más vendido
                </h2>
                <p className="text-3xl font-black text-amber-400">
                  {plataformaQ.data.nombre}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {plataformaQ.data.total_vendido} unidades vendidas
                </p>
              </div>
            )}

            {/* Ticket promedio + Ingresos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ticketQ.data && (
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-white mb-2">
                    💰 Ticket Promedio
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Promedio por pedido</p>
                      <p className="text-2xl font-black text-emerald-400">
                        ${ticketQ.data.promedio.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total pedidos</p>
                      <p className="text-2xl font-black text-white">
                        {ticketQ.data.total_pedidos}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Ingresos totales</p>
                      <p className="text-2xl font-black text-amber-400">
                        ${ticketQ.data.ingresos_totales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {ingresosQ.data && (
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-white mb-2">
                    📈 Resumen de Ingresos
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Total ingresos</p>
                      <p className="text-2xl font-black text-emerald-400">
                        ${ingresosQ.data.total_ingresos.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Cantidad pedidos</p>
                      <p className="text-2xl font-black text-white">
                        {ingresosQ.data.cantidad_pedidos}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Promedio por pedido</p>
                      <p className="text-2xl font-black text-amber-400">
                        ${ingresosQ.data.promedio.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pedidos por estado — PieChart */}
            {pedidosPorEstadoQ.data && pedidosPorEstadoQ.data.pedidos.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  🍩 Pedidos por estado
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="h-64 w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pedidosPorEstadoQ.data.pedidos.map((p) => ({
                            name: p.estado,
                            value: p.cantidad,
                          }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                          labelLine={false}
                        >
                          {pedidosPorEstadoQ.data.pedidos.map((p) => (
                            <Cell
                              key={p.estado}
                              fill={ESTADO_COLORS[p.estado] ?? '#6b7280'}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1a1a2e',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                          }}
                        />
                        <Legend
                          formatter={(value: string) => (
                            <span style={{ color: '#d1d5db' }}>{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/2 space-y-2">
                    {pedidosPorEstadoQ.data.pedidos.map((p) => (
                      <div
                        key={p.estado}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: ESTADO_COLORS[p.estado] ?? '#6b7280' }}
                          />
                          <span className="text-gray-300 capitalize">{p.estado}</span>
                        </div>
                        <span className="text-white font-bold">{p.cantidad}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pedidos por período */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                📅 Pedidos por período
              </h2>

              <div className="flex flex-wrap gap-3 mb-6">
                <input
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  className="input-field flex-1 min-w-[140px]"
                  placeholder="Desde"
                />
                <input
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className="input-field flex-1 min-w-[140px]"
                  placeholder="Hasta"
                />
              </div>

              {periodoQ.data && periodoQ.data.pedidos.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={periodoQ.data.pedidos}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="fecha"
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a2e',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                      />
                      <Bar
                        dataKey="cantidad"
                        fill="rgb(251,191,36)"
                        radius={[4, 4, 0, 0]}
                        name="Pedidos"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Sin datos para el período seleccionado.</p>
              )}
            </div>

            {/* Ranking de productos */}
            {rankingQ.data && rankingQ.data.ranking.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  🏅 Ranking de productos
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 border-b border-white/5">
                        <th className="text-left py-3 px-2">#</th>
                        <th className="text-left py-3 px-2">Producto</th>
                        <th className="text-right py-3 px-2">Vendidos</th>
                        <th className="text-right py-3 px-2">Ingresos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankingQ.data.ranking.map((item, idx) => (
                        <tr key={item.producto_id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="py-3 px-2 text-gray-400 font-mono">{idx + 1}</td>
                          <td className="py-3 px-2 text-white font-medium">{item.nombre}</td>
                          <td className="py-3 px-2 text-right text-amber-400 font-semibold">{item.total_vendido}</td>
                          <td className="py-3 px-2 text-right text-emerald-400 font-semibold">
                            ${item.ingresos.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="card p-4 text-center">
      <span className="text-3xl block mb-2">{icon}</span>
      <p className="text-2xl font-black text-white mb-1">{value}</p>
      <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
    </div>
  );
}
