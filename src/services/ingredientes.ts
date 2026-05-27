import apiClient from './apiClient';
import { Ingrediente } from '../types';

export const getIngredientes = () =>
  apiClient.get<Ingrediente[]>('/ingredientes').then((r) => r.data);

export const getIngrediente = (id: number) =>
  apiClient.get<Ingrediente>(`/ingredientes/${id}`).then((r) => r.data);

export const createIngrediente = (data: Partial<Ingrediente>) =>
  apiClient.post<Ingrediente>('/ingredientes', data).then((r) => r.data);

export const updateIngrediente = (id: number, data: Partial<Ingrediente>) =>
  apiClient.put<Ingrediente>(`/ingredientes/${id}`, data).then((r) => r.data);

export const deleteIngrediente = (id: number) =>
  apiClient.delete<{ message: string }>(`/ingredientes/${id}`).then((r) => r.data);
