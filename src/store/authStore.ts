import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserResponse, LoginRequest, RegisterRequest } from '../services/auth';
import * as authService from '../services/auth';

interface AuthState {
  user: UserResponse | null;
  loading: boolean;
  setUser: (user: UserResponse | null) => void;
  setLoading: (loading: boolean) => void;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  hasRole: (...roles: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),

      login: async (data: LoginRequest) => {
        const resp = await authService.login(data);
        set({ user: resp.usuario });
      },

      register: async (data: RegisterRequest) => {
        const usuario = await authService.register(data);
        await get().login({ email: data.email, password: data.password });
      },

      logout: async () => {
        await authService.logout();
        set({ user: null });
      },

      isAuthenticated: () => get().user !== null,

      hasRole: (...roles: string[]) => {
        const { user } = get();
        if (!user) return false;
        return roles.map((r) => r.toUpperCase()).includes(user.rol.toUpperCase());
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

// Inicializar sesión al cargar
authService
  .getMe()
  .then((u) => useAuthStore.getState().setUser(u))
  .finally(() => useAuthStore.getState().setLoading(false));
