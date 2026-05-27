import { Link } from 'react-router-dom';

const menuItems = [
  { path: '/admin/categorias', label: 'Categorías', icon: '📁', desc: 'Gestiona las categorías del menú', gradient: 'from-blue-600/40 to-blue-800/20' },
  { path: '/admin/ingredientes', label: 'Ingredientes', icon: '🥬', desc: 'Administra los ingredientes disponibles', gradient: 'from-green-600/40 to-green-800/20' },
  { path: '/admin/productos', label: 'Productos', icon: '🍔', desc: 'Crea y modifica productos del menú', gradient: 'from-amber-600/40 to-amber-800/20' },
  { path: '/admin/pedidos', label: 'Pedidos', icon: '📋', desc: 'Visualiza y gestiona los pedidos', gradient: 'from-purple-600/40 to-purple-800/20' },
  { path: '/admin/usuarios', label: 'Usuarios', icon: '👤', desc: 'Gestiona los usuarios del sistema', gradient: 'from-indigo-600/40 to-indigo-800/20' },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden pb-16">
        <div className="absolute inset-0 hero-gradient opacity-60" />
        <div className="px-4 md:px-6 lg:px-8 pt-20 pb-10 text-center relative z-10">
          <div className="text-6xl mb-4 animate-float">🍔</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Panel de Administración
            </span>
          </h1>
          <p className="text-xl text-gray-400 font-light">Burger House — Gestión Integral</p>
        </div>
      </div>

      {/* Cards */}
      <main className="px-4 md:px-6 lg:px-8 -mt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger">
          {menuItems.map((item) => (
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
