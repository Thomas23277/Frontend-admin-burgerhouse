import { useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  username: string;
  nombre: string;
  rolActual: string;
  onClose: () => void;
  onSave: (rol: string) => void;
}

export default function EditarRolModal({ username, nombre, rolActual, onClose, onSave }: Props) {
  const [rol, setRol] = useState(rolActual);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(rol);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <form onSubmit={handleSubmit} className="card w-full max-w-md p-8 animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-2">
          <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            Editar Rol
          </span>
        </h2>
        <p className="text-gray-400 mb-6">
          {nombre} · <span className="text-gray-500">@{username}</span>
        </p>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Rol</label>
          <select value={rol} onChange={(e) => setRol(e.target.value)}
            className="select w-full">
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
            <option value="pedidos">Pedidos</option>
            <option value="stock">Stock</option>
          </select>
        </div>
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onClose}
            className="btn-secondary text-base px-6 py-3">Cancelar</button>
          <button type="submit"
            className="btn-primary text-base px-6 py-3">Guardar</button>
        </div>
      </form>
    </div>,
    document.body
  );
}
