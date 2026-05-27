import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { UserResponse, LoginRequest, RegisterRequest } from '../services/auth';
import * as authService from '../services/auth';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount (cookie may still be valid)
  useEffect(() => {
    authService
      .getMe()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const resp = await authService.login(data);
    setUser(resp.usuario);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const usuario = await authService.register(data);
    // After register, login automatically
    await login({ email: data.email, password: data.password });
  }, [login]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles: string[]) => {
      if (!user) return false;
      return roles.map((r) => r.toUpperCase()).includes(user.rol.toUpperCase());
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
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
