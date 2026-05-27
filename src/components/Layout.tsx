import Navbar from './Navbar';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-pattern">
      <Navbar />
      <main className="relative z-10 w-full flex-1">
        {children}
      </main>
      {/* Footer global */}
      <footer className="relative z-10 border-t border-white/5 py-6 text-center">
        <div className="px-4 md:px-6 lg:px-8">
          <p className="text-gray-500 text-sm">
            🍔 Burger House — Hecho con amor y 🧂
          </p>
        </div>
      </footer>
    </div>
  );
}
