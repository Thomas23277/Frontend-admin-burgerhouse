import { useState, useEffect } from 'react';
import { Ingrediente } from '../../types';

interface Props {
  editando?: Ingrediente | null;
  onClose: () => void;
  onSave: (data: Partial<Ingrediente>) => void;
}

export default function IngredienteModal({ editando, onClose, onSave }: Props) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio_adicional: 0, imagen_url: '', disponible: true });

  useEffect(() => {
    if (editando) {
      setForm({
        nombre: editando.nombre,
        descripcion: editando.descripcion || '',
        precio_adicional: editando.precio_adicional,
        imagen_url: editando.imagen_url || '',
        disponible: editando.disponible,
      });
    }
  }, [editando]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-lg p-8 animate-fadeInUp">
        <h2 className="text-2xl font-bold mb-6">
          <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            {editando ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
          </span>
        </h2>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="input" required />
            <input type="number" step="0.01" placeholder="Precio adicional" value={form.precio_adicional}
              onChange={(e) => setForm({ ...form, precio_adicional: parseFloat(e.target.value) || 0 })}
              className="input" />
          </div>
          <input type="url" placeholder="URL de la imagen" value={form.imagen_url}
            onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
            className="input" />
          {form.imagen_url && (
            <div className="relative w-full h-32 rounded-xl overflow-hidden bg-white/5">
              <img src={form.imagen_url} alt="Preview" className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="btn-secondary text-base px-6 py-3">Cancelar</button>
            <button type="submit"
              className="btn-primary text-base px-6 py-3">{editando ? 'Actualizar' : 'Crear'}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
