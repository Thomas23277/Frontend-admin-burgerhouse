import { useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  onClose: () => void;
  onSave: (data: { username: string; email: string; nombre: string; password: string; rol: string }) => void;
}

export default function UsuarioModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState({ username: '', email: '', nombre: '', password: '', rol: 'cliente' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-lg p-8 animate-fadeInUp">
        <h2 className="text-2xl font-bold mb-6">
          <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            Nuevo Usuario
          </span>
        </h2>
        <div className="grid gap-4">
          <input type="text" placeholder="Username" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="input" required />
          <input type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input" required />
          <input type="text" placeholder="Nombre completo" value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="input" required />
          <input type="password" placeholder="Contraseña" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input" required />
          <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}
            className="select">
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="btn-secondary text-base px-6 py-3">Cancelar</button>
            <button type="submit"
              className="btn-primary text-base px-6 py-3">Crear</button>
          </div>
        </div>
      </form>
    </div>,
    document.body
  );
}
