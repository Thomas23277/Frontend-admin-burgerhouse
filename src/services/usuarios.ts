import apiClient from './apiClient';
import { Usuario } from '../types';

export const getUsuarios = () =>
  apiClient.get<Usuario[]>('/usuarios').then((r) => r.data);

export const createUsuario = (data: Partial<Usuario & { password: string }>) =>
  apiClient.post<Usuario>('/usuarios', data).then((r) => r.data);

export const updateUsuario = (id: number, data: { rol: string }) =>
  apiClient.put<Usuario>(`/usuarios/${id}`, data).then((r) => r.data);
