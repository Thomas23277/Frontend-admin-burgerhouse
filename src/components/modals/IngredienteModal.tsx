import { useState, useEffect } from 'react';
import { Ingrediente } from '../../types';

interface Props {
  editando?: Ingrediente | null;
  onClose: () => void;
  onSave: (data: Partial<Ingrediente>) => void;
}

export default function IngredienteModal({ editando, onClose, onSave }: Props) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio_adicional: 0, imagen_url: '', disponible: true, alergeno: false });

  useEffect(() => {
    if (editando) {
      setForm({
        nombre: editando.nombre,
        descripcion: editando.descripcion || '',
        precio_adicional: editando.precio_adicional,
        imagen_url: editando.imagen_url || '',
        disponible: editando.disponible,
        alergeno: editando.alergeno ?? false,
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

          {/* Checkbox alérgeno */}
          <label className="flex items-center gap-3 cursor-pointer select-none py-2">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.alergeno}
                onChange={(e) => setForm({ ...form, alergeno: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-5 h-5 rounded-md border-2 border-gray-500 peer-checked:border-amber-500 peer-checked:bg-amber-500/20 transition-all flex items-center justify-center">
                {form.alergeno && <span className="text-amber-400 text-sm font-bold">✓</span>}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">⚠️ Es alérgeno</span>
              <span className="text-xs text-gray-500">Se marcará visualmente en los productos que contengan este ingrediente</span>
            </div>
          </label>

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
