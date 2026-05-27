import { useState, useEffect } from 'react';
import { Producto, Categoria, Ingrediente } from '../../types';

interface Props {
  editando?: Producto | null;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function ProductoModal({ editando, categorias, ingredientes, onClose, onSave }: Props) {
  const [form, setForm] = useState<any>({
    nombre: '', descripcion: '', precio_base: '', imagenes_url: '',
    stock_cantidad: '', disponible: true, categorias: [], ingredientes: [],
  });

  useEffect(() => {
    if (editando) {
      setForm({
        nombre: editando.nombre, descripcion: editando.descripcion || '',
        precio_base: editando.precio_base?.toString() || '', imagenes_url: editando.imagenes_url || '',
        stock_cantidad: editando.stock_cantidad?.toString() || '', disponible: editando.disponible,
        categorias: editando.categorias?.map(c => ({ categoria_id: c.id, es_principal: c.es_principal })) || [],
        ingredientes: editando.ingredientes?.map(i => ({ ingrediente_id: i.id, es_removible: false })) || [],
      });
    }
  }, [editando]);

  const toggleCategoria = (id: number) => {
    setForm((prev: any) => {
      const exists = prev.categorias.find((c: any) => c.categoria_id === id);
      if (exists) return { ...prev, categorias: prev.categorias.filter((c: any) => c.categoria_id !== id) };
      return { ...prev, categorias: [...prev.categorias, { categoria_id: id, es_principal: prev.categorias.length === 0 }] };
    });
  };

  const toggleIngrediente = (id: number) => {
    setForm((prev: any) => {
      const exists = prev.ingredientes.find((i: any) => i.ingrediente_id === id);
      if (exists) return { ...prev, ingredientes: prev.ingredientes.filter((i: any) => i.ingrediente_id !== id) };
      return { ...prev, ingredientes: [...prev.ingredientes, { ingrediente_id: id, es_removible: false }] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      precio_base: parseFloat(form.precio_base) || 0,
      stock_cantidad: parseInt(form.stock_cantidad) || 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 animate-fadeInUp">
        <h2 className="text-2xl font-bold mb-6">
          <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            {editando ? 'Editar Producto' : 'Nuevo Producto'}
          </span>
        </h2>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="input" required />
            <input type="number" step="0.01" placeholder="Precio base" value={form.precio_base}
              onChange={(e) => setForm({ ...form, precio_base: e.target.value })}
              className="input" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="url" placeholder="URL de la imagen" value={form.imagenes_url}
              onChange={(e) => setForm({ ...form, imagenes_url: e.target.value })}
              className="input" />
            <input type="number" placeholder="Stock" value={form.stock_cantidad}
              onChange={(e) => setForm({ ...form, stock_cantidad: e.target.value })}
              className="input" />
          </div>
          {form.imagenes_url && (
            <div className="relative w-full h-32 rounded-xl overflow-hidden bg-white/5">
              <img src={form.imagenes_url} alt="Preview" className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
          <textarea placeholder="Descripción" value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="input" rows={2} />
          {categorias.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-sm text-gray-300">Categorías</h3>
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => (
                  <button type="button" key={cat.id} onClick={() => toggleCategoria(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      form.categorias.find((c: any) => c.categoria_id === cat.id)
                        ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}
          {ingredientes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-sm text-gray-300">Ingredientes</h3>
              <div className="flex flex-wrap gap-2">
                {ingredientes.map((ing) => (
                  <button type="button" key={ing.id} onClick={() => toggleIngrediente(ing.id)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      form.ingredientes.find((i: any) => i.ingrediente_id === ing.id)
                        ? 'bg-green-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
                    {ing.nombre}
                  </button>
                ))}
              </div>
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
