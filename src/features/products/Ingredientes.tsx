import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ingredientesService from '../../services/ingredientes';
import IngredienteModal from '../../components/modals/IngredienteModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { Ingrediente } from '../../types';
import { useAuth } from '../../context/AuthContext';

export default function Ingredientes() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const esAdmin = user?.rol?.toUpperCase() === 'ADMIN';
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Ingrediente | null>(null);

  const { data: ingredientes, isLoading } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: ingredientesService.getIngredientes,
  });

  const createMut = useMutation({
    mutationFn: ingredientesService.createIngrediente,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ingredientes'] }); setModalOpen(false); },
    onError: (err: Error) => alert(err.message || 'Error al crear ingrediente'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Ingrediente> }) => ingredientesService.updateIngrediente(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ingredientes'] }); setModalOpen(false); },
    onError: (err: Error) => alert(err.message || 'Error al actualizar ingrediente'),
  });

  const deleteMut = useMutation({
    mutationFn: ingredientesService.deleteIngrediente,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredientes'] }),
    onError: (err: Error) => alert(err.message || 'Error al eliminar ingrediente'),
  });

  const handleEdit = (ing: Ingrediente) => {
    setEditando(ing);
    setModalOpen(true);
  };

  const handleSave = (data: Partial<Ingrediente>) => {
    if (editando) {
      updateMut.mutate({ id: editando.id, data });
    } else {
      createMut.mutate(data);
    }
  };

  if (isLoading) return <LoadingSpinner text="Cargando ingredientes..." />;

  return (
    <div className="min-h-screen">
      <div className="px-4 md:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-start mb-8 animate-fadeInUp">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                🥬 Ingredientes
              </span>
            </h1>
            <p className="text-gray-500 text-lg">Administra los ingredientes disponibles</p>
          </div>
          {esAdmin && (
            <button onClick={() => { setEditando(null); setModalOpen(true); }}
              className="btn-primary text-base px-6 py-3">
              + Nuevo Ingrediente
            </button>
          )}
        </div>

        <div className="space-y-4 stagger">
          {ingredientes?.length === 0 ? (
            <EmptyState icon="🥬" title="No hay ingredientes todavía" subtitle="Crea tu primer ingrediente para empezar" />
          ) : (
            ingredientes?.map((ing) => (
              <div key={ing.id} className="card p-5 flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  {ing.imagen_url ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      <img src={ing.imagen_url} alt={ing.nombre} className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center text-2xl flex-shrink-0">
                      🥬
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      {ing.nombre}
                      {ing.alergeno && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium">
                          ⚠️ Alérgeno
                        </span>
                      )}
                    </h3>
                    <p className="text-green-400 font-bold mt-0.5">+${(ing.precio_adicional || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {esAdmin && (
                    <>
                      <button onClick={() => handleEdit(ing)}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-medium transition cursor-pointer">
                        ✏️ Editar
                      </button>
                      <button onClick={() => deleteMut.mutate(ing.id)}
                        className="btn-danger text-sm px-4 py-2">
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {modalOpen && (
          <IngredienteModal editando={editando} onClose={() => { setModalOpen(false); setEditando(null); }} onSave={handleSave} />
        )}
      </div>
    </div>
  );
}
