import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  desc: string;
  gradient: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    path: '/admin/categorias',
    label: 'Categorías',
    icon: '📁',
    desc: 'Consultá las categorías del menú',
    gradient: 'from-blue-600/40 to-blue-800/20',
    roles: ['ADMIN', 'STOCK'],
  },
  {
    path: '/admin/ingredientes',
    label: 'Ingredientes',
    icon: '🥬',
    desc: 'Consultá los ingredientes disponibles',
    gradient: 'from-green-600/40 to-green-800/20',
    roles: ['ADMIN', 'STOCK'],
  },
  {
    path: '/admin/productos',
    label: 'Productos',
    icon: '🍔',
    desc: 'Gestioná productos y su disponibilidad',
    gradient: 'from-amber-600/40 to-amber-800/20',
    roles: ['ADMIN', 'STOCK'],
  },
  {
    path: '/admin/pedidos',
    label: 'Pedidos',
    icon: '📋',
    desc: 'Visualizá y gestioná los pedidos',
    gradient: 'from-purple-600/40 to-purple-800/20',
    roles: ['ADMIN', 'PEDIDOS'],
  },
  {
    path: '/admin/usuarios',
    label: 'Usuarios',
    icon: '👤',
    desc: 'Gestioná los usuarios del sistema',
    gradient: 'from-indigo-600/40 to-indigo-800/20',
    roles: ['ADMIN'],
  },
];

export default function EmpleadoDashboard() {
  const { user } = useAuth();
  const userRol = user?.rol?.toUpperCase() ?? '';

  const allowedItems = menuItems.filter((item) =>
    item.roles.includes(userRol),
  );

  const rolTitle: Record<string, string> = {
    ADMIN: 'Panel de Administración',
    PEDIDOS: 'Panel de Pedidos',
    STOCK: 'Panel de Stock',
  };

  const title = rolTitle[userRol] ?? 'Panel';

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden pb-16">
        <div className="absolute inset-0 hero-gradient opacity-60" />
        <div className="px-4 md:px-6 lg:px-8 pt-20 pb-10 text-center relative z-10">
          <div className="text-6xl mb-4 animate-float">🍔</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-xl text-gray-400 font-light">
            Burger House — {user?.nombre}
          </p>
        </div>
      </div>

      {/* Cards */}
      <main className="px-4 md:px-6 lg:px-8 -mt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger">
          {allowedItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`card p-8 group overflow-hidden relative bg-gradient-to-br ${item.gradient} hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="flex items-center gap-6 relative z-10">
                <span className="text-5xl bg-white/10 backdrop-blur-sm p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{item.label}</h2>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">
                {item.icon}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
