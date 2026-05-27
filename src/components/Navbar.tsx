import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, loading, logout } = useAuth();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const roleBadge = (rol: string | undefined) => {
    if (!rol) return null;
    const colors: Record<string, string> = {
      admin: 'badge-amber',
      pedidos: 'badge-blue',
      stock: 'badge-green',
      cliente: 'badge-gray',
    };
    const displayNames: Record<string, string> = {
      admin: 'ADMIN',
      pedidos: 'PEDIDOS',
      stock: 'STOCK',
      cliente: 'CLIENTE',
    };
    const key = rol.toLowerCase();
    return (
      <span className={`badge ${colors[key] ?? 'badge-gray'}`}>
        {displayNames[key] ?? rol.toUpperCase()}
      </span>
    );
  };

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', roles: ['ADMIN'] },
    { path: '/admin/productos', label: 'Productos', roles: ['ADMIN', 'STOCK'] },
    { path: '/admin/categorias', label: 'Categorías', roles: ['ADMIN', 'STOCK'] },
    { path: '/admin/ingredientes', label: 'Ingredientes', roles: ['ADMIN', 'STOCK'] },
    { path: '/admin/pedidos', label: 'Pedidos', roles: ['ADMIN', 'PEDIDOS'] },
    { path: '/admin/usuarios', label: 'Usuarios', roles: ['ADMIN'] },
  ];

  const userRole = user?.rol?.toUpperCase() ?? '';

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🍔</span>
            <span className="font-bold text-lg bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Burger House
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {adminLinks
              .filter((link) => link.roles.includes(userRole))
              .map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive(link.path)
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

            {/* Auth */}
            <div className="ml-4 pl-4 border-l border-white/10 flex items-center gap-3">
              {loading ? (
                <div className="w-24 h-8 rounded-lg bg-white/5 animate-pulse" />
              ) : user ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-black">
                      {user.nombre.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-300 text-sm font-medium hidden lg:block">
                      {user.nombre}
                    </span>
                    {roleBadge(user.rol)}
                  </div>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-amber-400 text-sm font-medium transition cursor-pointer"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-primary text-sm">
                  Ingresar
                </Link>
              )}
            </div>
          </div>

          {/* Mobile: solo logout */}
          <div className="md:hidden flex items-center gap-2">
            {loading ? null : user ? (
              <button onClick={logout} className="text-gray-400 text-sm p-2 hover:text-amber-400 cursor-pointer">
                ✕ Salir
              </button>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-1.5 px-3">
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
