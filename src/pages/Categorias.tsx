import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import * as categoriasService from '../services/categorias';
import CategoriaModal from '../components/modals/CategoriaModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { Categoria } from '../types';

export default function Categorias() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const esAdmin = user?.rol?.toUpperCase() === 'ADMIN';
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);

  const { data: categorias, isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasService.getCategorias,
  });

  const createMut = useMutation({
    mutationFn: categoriasService.createCategoria,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categorias'] }); setModalOpen(false); },
    onError: (err: Error) => alert(err.message || 'Error al crear categoría'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Categoria> }) => categoriasService.updateCategoria(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categorias'] }); setModalOpen(false); },
    onError: (err: Error) => alert(err.message || 'Error al actualizar categoría'),
  });

  const deleteMut = useMutation({
    mutationFn: categoriasService.deleteCategoria,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categorias'] }),
    onError: (err: Error) => alert(err.message || 'Error al eliminar categoría'),
  });

  const handleEdit = (cat: Categoria) => {
    setEditando(cat);
    setModalOpen(true);
  };

  const handleSave = (data: Partial<Categoria>) => {
    if (editando) {
      updateMut.mutate({ id: editando.id, data });
    } else {
      createMut.mutate(data);
    }
  };

  // ── Render recursivo de categorías ──────────────────────
  const renderCategoria = (cat: Categoria, depth = 0) => (
    <div key={cat.id}>
      <div
        className="card p-5 flex justify-between items-center gap-4"
        style={{ marginLeft: depth * 24 }}
      >
        <div className="flex items-center gap-4">
          {cat.imagen_url ? (
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
              <img src={cat.imagen_url} alt={cat.nombre} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center text-2xl flex-shrink-0">
              {depth === 0 ? '📁' : '📂'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white">{cat.nombre}</h3>
              {depth > 0 && (
                <span className="badge badge-gray text-[10px]">subcategoría</span>
              )}
              {cat.es_principal && (
                <span className="badge badge-amber text-[10px]">⭐ Principal</span>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-0.5">{cat.descripcion}</p>
          </div>
        </div>
        {esAdmin && (
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => handleEdit(cat)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-medium transition cursor-pointer">
              ✏️ Editar
            </button>
            <button onClick={() => deleteMut.mutate(cat.id)}
              className="btn-danger text-sm px-4 py-2">
              🗑️
            </button>
          </div>
        )}
      </div>
      {cat.subcategorias && cat.subcategorias.length > 0 && (
        <div className="space-y-3 mt-3">
          {cat.subcategorias.map((sub) => renderCategoria(sub, depth + 1))}
        </div>
      )}
    </div>
  );

  if (isLoading) return <LoadingSpinner text="Cargando categorías..." />;

  return (
    <div className="min-h-screen">
      <div className="px-4 md:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-start mb-8 animate-fadeInUp">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                📁 Categorías
              </span>
            </h1>
            <p className="text-gray-500 text-lg">Gestiona las categorías del menú</p>
          </div>
          {esAdmin && (
            <button onClick={() => { setEditando(null); setModalOpen(true); }}
              className="btn-primary text-base px-6 py-3">
              + Nueva Categoría
            </button>
          )}
        </div>

        <div className="space-y-4 stagger">
          {(!categorias || categorias.length === 0) ? (
            <EmptyState icon="📁" title="No hay categorías todavía" subtitle="Crea tu primera categoría para empezar" />
          ) : (
            categorias.map((cat) => renderCategoria(cat))
          )}
        </div>

        {modalOpen && (
          <CategoriaModal editando={editando} categorias={categorias} onClose={() => { setModalOpen(false); setEditando(null); }} onSave={handleSave} />
        )}
      </div>
    </div>
  );
}
