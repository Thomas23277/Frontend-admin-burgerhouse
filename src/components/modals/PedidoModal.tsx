import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Usuario, Producto } from '../../types';

interface DetalleForm {
  producto_id: number;
  cantidad: number;
  notas: string;
}

interface Props {
  productos: Producto[];
  usuarios: Usuario[];
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function PedidoModal({ productos, usuarios, onClose, onSave }: Props) {
  const [form, setForm] = useState({ usuario_id: '', notas: '', detalles: [] as DetalleForm[] });

  const addDetalle = (productoId: number) => {
    setForm(prev => ({
      ...prev, detalles: [...prev.detalles, { producto_id: productoId, cantidad: 1, notas: '' }]
    }));
  };

  const removeDetalle = (index: number) => {
    setForm(prev => ({ ...prev, detalles: prev.detalles.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.usuario_id) return;
    onSave({ ...form, usuario_id: parseInt(form.usuario_id) });
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 animate-fadeInUp">
        <h2 className="text-2xl font-bold mb-6">
          <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            Nuevo Pedido
          </span>
        </h2>
        <div className="grid gap-4">
          <select value={form.usuario_id} onChange={(e) => setForm({ ...form, usuario_id: e.target.value })}
            className="select" required>
            <option value="">Seleccionar usuario</option>
            {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
          </select>
          <div>
            <h3 className="font-semibold mb-2 text-sm text-gray-300">Productos</h3>
            <div className="flex flex-wrap gap-2">
              {productos.filter(p => p.disponible).map(p => (
                <button type="button" key={p.id} onClick={() => addDetalle(p.id)}
                  className="bg-white/5 text-gray-400 px-3 py-1.5 rounded-xl text-sm hover:bg-white/10 hover:text-white transition cursor-pointer">
                  + {p.nombre}
                </button>
              ))}
            </div>
          </div>
          {form.detalles.map((d, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <span className="flex-1 font-medium text-white">{productos.find(p => p.id === d.producto_id)?.nombre}</span>
              <input type="number" min="1" value={d.cantidad}
                onChange={(e) => setForm(prev => ({
                  ...prev, detalles: prev.detalles.map((x, j) => j === i ? { ...x, cantidad: parseInt(e.target.value) || 1 } : x)
                }))}
                className="input w-20" />
              <button type="button" onClick={() => removeDetalle(i)}
                className="px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition cursor-pointer">✕</button>
            </div>
          ))}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="btn-secondary text-base px-6 py-3">Cancelar</button>
            <button type="submit" disabled={form.detalles.length === 0 || !form.usuario_id}
              className="btn-primary text-base px-6 py-3 disabled:opacity-50">Crear</button>
          </div>
        </div>
      </form>
    </div>,
    document.body
  );
}
