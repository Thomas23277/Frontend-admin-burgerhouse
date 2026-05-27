import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as productosService from '../services/productos';
import * as categoriasService from '../services/categorias';
import * as ingredientesService from '../services/ingredientes';
import ProductoModal from '../components/modals/ProductoModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

import type { Producto, Categoria, Ingrediente } from '../types';

export default function Productos() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const esAdmin = user?.rol?.toUpperCase() === 'ADMIN';
  const esStock = user?.rol?.toUpperCase() === 'STOCK';
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<any>(null);

  const { data: productos, isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: (): Promise<Producto[]> => productosService.getProductos(),
  });
  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: (): Promise<Categoria[]> => categoriasService.getCategorias(),
  });
  const { data: ingredientes } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: (): Promise<Ingrediente[]> => ingredientesService.getIngredientes(),
  });

  const createMut = useMutation({
    mutationFn: productosService.createProducto,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); setModalOpen(false); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: any) => productosService.updateProducto(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); setModalOpen(false); },
  });

  const deleteMut = useMutation({
    mutationFn: productosService.deleteProducto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] }),
  });

  const toggleDispMut = useMutation({
    mutationFn: productosService.toggleDisponibilidad,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] }),
    onError: (err: Error) => alert(err.message || 'Error al cambiar disponibilidad'),
  });

  if (isLoading) return <LoadingSpinner text="Cargando productos..." />;

  return (
    <div className="min-h-screen">
      <div className="px-4 md:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-start mb-8 animate-fadeInUp">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                🍔 Productos
              </span>
            </h1>
            <p className="text-gray-500 text-lg">Crea y modifica productos del menú</p>
          </div>
          {esAdmin && (
            <button onClick={() => { setEditando(null); setModalOpen(true); }}
              className="btn-primary text-base px-6 py-3">
              + Nuevo Producto
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {productos?.length === 0 ? (
            <div className="col-span-full">
              <EmptyState icon="🍔" title="No hay productos todavía" subtitle="Crea tu primer producto para empezar" />
            </div>
          ) : (
            productos?.map((prod) => (
              <div key={prod.id} className="card overflow-hidden group">
                <div className={`relative h-48 ${prod.imagenes_url ? '' : 'bg-gradient-to-br from-amber-500/20 to-amber-600/10'}`}>
                  {prod.imagenes_url ? (
                    <img src={prod.imagenes_url} alt={prod.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">🍔</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white">{prod.nombre}</h3>
                    <span className="text-amber-400 font-bold text-lg">${(prod.precio_base || 0).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2 mt-1 mb-3">{prod.descripcion}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {prod.categorias?.slice(0, 3).map((cat: any) => (
                      <span key={cat.id} className="badge badge-amber text-[10px]">{cat.nombre}</span>
                    ))}
                  </div>

                  <div className="flex justify-end items-center pt-3 border-t border-white/5 gap-2 flex-wrap">
                    <div className="flex gap-1.5">
                      {esAdmin && (
                        <>
                          <button onClick={() => { setEditando(prod); setModalOpen(true); }}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium transition cursor-pointer">
                            ✏️
                          </button>
                          <button onClick={() => deleteMut.mutate(prod.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition cursor-pointer">
                            🗑️
                          </button>
                        </>
                      )}
                      {(esAdmin || esStock) && (
                        <button onClick={() => toggleDispMut.mutate(prod.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                            prod.disponible
                              ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                              : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          }`}>
                          {prod.disponible ? '🟢' : '🔴'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {modalOpen && (
          <ProductoModal editando={editando} categorias={categorias || []} ingredientes={ingredientes || []}
            onClose={() => { setModalOpen(false); setEditando(null); }}
            onSave={(data) => editando ? updateMut.mutate({ id: editando.id, data }) : createMut.mutate(data)} />
        )}
      </div>
    </div>
  );
}
