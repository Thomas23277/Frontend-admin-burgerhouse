import apiClient from './apiClient';
import { Categoria } from '../types';

export const getCategorias = () =>
  apiClient.get<Categoria[]>('/categorias').then((r) => r.data);

export const getCategoria = (id: number) =>
  apiClient.get<Categoria>(`/categorias/${id}`).then((r) => r.data);

export const createCategoria = (data: Partial<Categoria>) =>
  apiClient.post<Categoria>('/categorias', data).then((r) => r.data);

export const updateCategoria = (id: number, data: Partial<Categoria>) =>
  apiClient.put<Categoria>(`/categorias/${id}`, data).then((r) => r.data);

export const deleteCategoria = (id: number) =>
  apiClient.delete<{ message: string }>(`/categorias/${id}`).then((r) => r.data);
