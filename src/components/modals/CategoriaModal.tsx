import { useState, useEffect } from 'react';
import { Categoria } from '../../types';

interface Props {
  editando?: Categoria | null;
  onClose: () => void;
  onSave: (data: Partial<Categoria>) => void;
}

export default function CategoriaModal({ editando, onClose, onSave }: Props) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', imagen_url: '', parent_id: undefined as number | undefined, es_activa: true });

  useEffect(() => {
    if (editando) {
      setForm({
        nombre: editando.nombre,
        descripcion: editando.descripcion || '',
        imagen_url: editando.imagen_url || '',
        parent_id: editando.parent_id ?? undefined,
        es_activa: editando.es_activa,
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
            {editando ? 'Editar Categoría' : 'Nueva Categoría'}
          </span>
        </h2>
        <div className="grid gap-4">
          <input type="text" placeholder="Nombre" value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="input" required />
          <textarea placeholder="Descripción" value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="input" rows={3} />
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
