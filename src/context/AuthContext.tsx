import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import type { UserResponse, LoginRequest, RegisterRequest } from '../services/auth';
import { useAuthStore } from '../store/authStore';

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function useStore(): AuthContextType {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  return {
    user,
    loading,
    login: useAuthStore.getState().login,
    register: useAuthStore.getState().register,
    logout: useAuthStore.getState().logout,
    isAuthenticated: user !== null,
    hasRole: (...roles: string[]) => {
      if (!user) return false;
      return roles.map((r) => r.toUpperCase()).includes(user.rol.toUpperCase());
    },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useStore();

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return ctx;
}
