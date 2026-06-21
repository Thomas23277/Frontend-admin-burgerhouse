import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Ingrediente } from '../../types';
import * as cloudinaryService from '../../services/cloudinary';

interface Props {
  editando?: Ingrediente | null;
  onClose: () => void;
  onSave: (data: Partial<Ingrediente>) => void;
}

export default function IngredienteModal({ editando, onClose, onSave }: Props) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio_adicional: 0, imagen_url: '', disponible: true, alergeno: false });
  const [subiendoImg, setSubiendoImg] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const subirImagen = async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
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
      setForm((prev: any) => ({ ...prev, imagen_url: result.secure_url }));
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

  const quitarImagen = () => {
    setForm((prev: any) => ({ ...prev, imagen_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return createPortal(
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

          {/* ── Cloudinary Upload ── */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Imagen del ingrediente</label>
            {form.imagen_url ? (
              <div className="relative w-full h-32 rounded-xl overflow-hidden bg-white/5 group">
                <img src={form.imagen_url} alt="Preview" className="w-full h-full object-cover" />
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
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition cursor-pointer
                  ${subiendoImg
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-white/10 bg-white/5 hover:border-amber-400/50 hover:bg-amber-500/5'
                  }`}>
                {subiendoImg ? (
                  <>
                    <div className="w-8 h-8 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                    <span className="text-sm text-amber-400 font-medium">Subiendo imagen...</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl">📸</span>
                    <span className="text-sm text-gray-400">Hacé clic para subir una imagen</span>
                    <span className="text-xs text-gray-500">JPG, PNG, WebP o GIF — Máx 10 MB</span>
                  </>
                )}
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange} className="hidden" />
            {imgError && <p className="mt-2 text-sm text-red-400">{imgError}</p>}
          </div>

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
    </div>,
    document.body
  );
}
