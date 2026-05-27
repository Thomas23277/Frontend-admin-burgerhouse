import apiClient from './apiClient';
import { Producto } from '../types';

export const getProductos = (params?: {
  categoria_id?: number;
  search?: string;
  disponible?: boolean;
}) =>
  apiClient.get<Producto[]>('/productos', { params }).then((r) => r.data);

export const getProducto = (id: number) =>
  apiClient.get<Producto>(`/productos/${id}`).then((r) => r.data);

export const getProductosDestacados = (limite: number = 6) =>
  apiClient.get<Producto[]>('/productos/destacados', { params: { limite } }).then((r) => r.data);

export const createProducto = (data: Partial<Producto>) =>
  apiClient.post<Producto>('/productos', data).then((r) => r.data);

export const updateProducto = (id: number, data: Partial<Producto>) =>
  apiClient.put<Producto>(`/productos/${id}`, data).then((r) => r.data);

export const deleteProducto = (id: number) =>
  apiClient.delete<{ message: string }>(`/productos/${id}`).then((r) => r.data);

export const toggleDisponibilidad = (id: number) =>
  apiClient.patch<Producto>(`/productos/${id}/disponibilidad`).then((r) => r.data);
