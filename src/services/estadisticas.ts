import apiClient from './apiClient';
import type {
  EstadisticasTotales,
  PedidosPeriodoResponse,
  PlataformaMasVendida,
  TicketPromedio,
  RankingProductosResponse,
  PedidosPorEstadoResponse,
  IngresosResponse,
} from '../types';

export const getTotales = () =>
  apiClient.get<EstadisticasTotales>('/estadisticas/totales').then((r) => r.data);

export const getPedidosPeriodo = (fecha_desde?: string, fecha_hasta?: string) =>
  apiClient
    .get<PedidosPeriodoResponse>('/estadisticas/pedidos-periodo', {
      params: { fecha_desde, fecha_hasta },
    })
    .then((r) => r.data);

export const getPlataformaMasVendida = () =>
  apiClient
    .get<PlataformaMasVendida>('/estadisticas/plataforma-mas-vendida')
    .then((r) => r.data);

export const getTicketPromedio = () =>
  apiClient.get<TicketPromedio>('/estadisticas/ticket-promedio').then((r) => r.data);

export const getRankingProductos = () =>
  apiClient
    .get<RankingProductosResponse>('/estadisticas/ranking-productos')
    .then((r) => r.data);

export const getPedidosPorEstado = () =>
  apiClient
    .get<PedidosPorEstadoResponse>('/estadisticas/pedidos-por-estado')
    .then((r) => r.data);

export const getIngresos = () =>
  apiClient
    .get<IngresosResponse>('/estadisticas/ingresos')
    .then((r) => r.data);
