import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';

interface Props {
  children: React.ReactNode;
  roles?: string[];
  /** Si es true, solo redirige a login si no está autenticado (sin check de rol) */
  requireAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  roles,
  requireAuth = false,
}: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner color="amber" size="lg" />
      </div>
    );
  }

  // Si requiere autenticación y no hay usuario, redirigir a login
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere roles específicos y el usuario no los tiene
  if (roles && user && !roles.map((r) => r.toUpperCase()).includes(user.rol.toUpperCase())) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <span className="text-6xl mb-4">🔒</span>
        <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
        <p className="text-gray-400">
          No tenés permisos para acceder a esta sección.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
