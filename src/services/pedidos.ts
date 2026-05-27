import apiClient from './apiClient';
import { Pedido, PedidoCreateData } from '../types';

export const getPedidos = () =>
  apiClient.get<Pedido[]>('/pedidos').then((r) => r.data);

export const getMisPedidos = () =>
  apiClient.get<Pedido[]>('/pedidos/mios').then((r) => r.data);

export const getPedido = (id: number) =>
  apiClient.get<Pedido>(`/pedidos/${id}`).then((r) => r.data);

export const createPedido = (data: PedidoCreateData) =>
  apiClient.post<Pedido>('/pedidos', data).then((r) => r.data);

export const updatePedido = (id: number, data: Partial<Pedido>) =>
  apiClient.put<Pedido>(`/pedidos/${id}`, data).then((r) => r.data);

export interface HistorialEstado {
  id: number;
  estado_anterior: string | null;
  estado_nuevo: string;
  cambiado_por: number;
  created_at: string;
}

export const getHistorialPedido = (id: number) =>
  apiClient.get<HistorialEstado[]>(`/pedidos/${id}/historial`).then((r) => r.data);
