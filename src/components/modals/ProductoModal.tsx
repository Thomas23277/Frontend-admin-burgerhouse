import { useState, useEffect, useRef } from 'react';
import { Producto, Categoria, Ingrediente } from '../../types';
import * as cloudinaryService from '../../services/cloudinary';

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
    variantes: [],
  });
  const [subiendoImg, setSubiendoImg] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editando) {
      setForm({
        nombre: editando.nombre, descripcion: editando.descripcion || '',
        precio_base: editando.precio_base?.toString() || '', imagenes_url: editando.imagenes_url || '',
        stock_cantidad: editando.stock_cantidad?.toString() || '', disponible: editando.disponible,
        categorias: editando.categorias?.map(c => ({ categoria_id: c.id, es_principal: c.es_principal })) || [],
        ingredientes: editando.ingredientes?.map(i => ({ ingrediente_id: i.id, es_removible: false })) || [],
        variantes: editando.variantes?.map((v: any) => ({
          tipo: v.tipo, valor: v.valor,
          precio_adicional: v.precio_adicional ?? 0,
          stock: v.stock ?? 0,
        })) || [],
      });
    }
  }, [editando]);

  const subirImagen = async (file: File) => {
    // Validar tipo y tamaño
    const tiposValidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!tiposValidos.includes(file.type)) {
      setImgError('Formato no permitido. Usá JPG, PNG, WebP o GIF.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setImgError('La imagen es muy grande. Máximo 10 MB.');
      return;
    }

    setSubiendoImg(true);
    setImgError(null);

    try {
      const result = await cloudinaryService.uploadImagen(file);
      setForm((prev: any) => ({ ...prev, imagenes_url: result.secure_url }));
      setPublicId(result.public_id);
    } catch (err: any) {
      setImgError(err?.message || 'Error al subir la imagen');
    } finally {
      setSubiendoImg(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) subirImagen(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) subirImagen(file);
  };

  const quitarImagen = () => {
    setForm((prev: any) => ({ ...prev, imagenes_url: '' }));
    setPublicId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
            <input type="number" placeholder="Stock" value={form.stock_cantidad}
              onChange={(e) => setForm({ ...form, stock_cantidad: e.target.value })}
              className="input" />
          </div>

          {/* ── Cloudinary Upload ── */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Imagen del producto</label>
            {form.imagenes_url ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden bg-white/5 group">
                <img src={form.imagenes_url} alt="Preview"
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition cursor-pointer">
                    🔄 Cambiar
                  </button>
                  <button type="button" onClick={quitarImagen}
                    className="px-4 py-2 rounded-lg bg-red-500/40 hover:bg-red-500/60 text-white text-sm font-medium transition cursor-pointer">
                    🗑️ Quitar
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition cursor-pointer
                  ${subiendoImg
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-white/10 bg-white/5 hover:border-amber-400/50 hover:bg-amber-500/5'
                  }`}>
                {subiendoImg ? (
                  <>
                    <div className="w-10 h-10 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                    <span className="text-sm text-amber-400 font-medium">Subiendo imagen...</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl">📸</span>
                    <span className="text-sm text-gray-400">Hacé clic o arrastrá una imagen</span>
                    <span className="text-xs text-gray-500">JPG, PNG, WebP o GIF — Máx 10 MB</span>
                  </>
                )}
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange} className="hidden" />
            {imgError && (
              <p className="mt-2 text-sm text-red-400">{imgError}</p>
            )}
          </div>

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
          {/* ── Variantes (talles / colores) ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm text-gray-300">Variantes (talles / colores)</h3>
              <button type="button" onClick={() =>
                setForm({ ...form, variantes: [...form.variantes, { tipo: 'talle', valor: '', precio_adicional: 0, stock: 0 }] })
              }
                className="text-xs text-amber-400 hover:text-amber-300 font-medium transition cursor-pointer">
                + Agregar variante
              </button>
            </div>
            {form.variantes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                      <th className="text-left py-1 w-28">Tipo</th>
                      <th className="text-left py-1">Valor</th>
                      <th className="text-right py-1 w-28">Precio +$</th>
                      <th className="text-right py-1 w-20">Stock</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {form.variantes.map((v: any, idx: number) => (
                      <tr key={idx} className="bg-white/5 rounded-xl">
                        <td className="py-1.5 pr-1">
                          <select value={v.tipo} onChange={(e) => {
                            const nuevas = [...form.variantes];
                            nuevas[idx] = { ...nuevas[idx], tipo: e.target.value };
                            setForm({ ...form, variantes: nuevas });
                          }}
                            className="input text-sm w-full">
                            <option value="talle">Talle</option>
                            <option value="color">Color</option>
                            <option value="otro">Otro</option>
                          </select>
                        </td>
                        <td className="py-1.5 px-1">
                          <input type="text" placeholder="S, M, L..." value={v.valor}
                            onChange={(e) => {
                              const nuevas = [...form.variantes];
                              nuevas[idx] = { ...nuevas[idx], valor: e.target.value };
                              setForm({ ...form, variantes: nuevas });
                            }}
                            className="input text-sm w-full" />
                        </td>
                        <td className="py-1.5 px-1">
                          <div className="flex items-center text-xs text-gray-400">
                            <span className="mr-0.5 shrink-0">$</span>
                            <input type="number" step="0.01" placeholder="0.00" value={v.precio_adicional}
                              onChange={(e) => {
                                const nuevas = [...form.variantes];
                                nuevas[idx] = { ...nuevas[idx], precio_adicional: parseFloat(e.target.value) || 0 };
                                setForm({ ...form, variantes: nuevas });
                              }}
                              className="input text-sm w-full text-right" />
                          </div>
                        </td>
                        <td className="py-1.5 px-1">
                          <input type="number" placeholder="0" value={v.stock}
                            onChange={(e) => {
                              const nuevas = [...form.variantes];
                              nuevas[idx] = { ...nuevas[idx], stock: parseInt(e.target.value) || 0 };
                              setForm({ ...form, variantes: nuevas });
                            }}
                            className="input text-sm w-full text-right" />
                        </td>
                        <td className="py-1.5 pl-1 text-center">
                          <button type="button" onClick={() =>
                            setForm({ ...form, variantes: form.variantes.filter((_: any, i: number) => i !== idx) })
                          }
                            className="text-red-400 hover:text-red-300 cursor-pointer transition text-base">
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Sin variantes. Agregá talles o colores si el producto los tiene.</p>
            )}
          </div>

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
