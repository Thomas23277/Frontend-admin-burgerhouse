import apiClient from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nombre: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  nombre: string;
  rol: string;
  created_at: string;
}

export interface LoginResponse {
  message: string;
  usuario: UserResponse;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const resp = await apiClient.post<LoginResponse>('/auth/login', data);
  return resp.data;
}

export async function register(data: RegisterRequest): Promise<UserResponse> {
  const resp = await apiClient.post<UserResponse>('/auth/register', data);
  return resp.data;
}

export async function getMe(): Promise<UserResponse> {
  const resp = await apiClient.get<UserResponse>('/auth/me');
  return resp.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
