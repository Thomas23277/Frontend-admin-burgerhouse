import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as usuariosService from '../../services/usuarios';
import UsuarioModal from '../../components/modals/UsuarioModal';
import EditarRolModal from '../../components/modals/EditarRolModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';

const rolBadge: Record<string, string> = {
  admin: 'badge-purple',
  pedidos: 'badge-blue',
  stock: 'badge-green',
  cliente: 'badge-gray',
};

export default function Usuarios() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<{ id: number; username: string; nombre: string; rol: string } | null>(null);

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: usuariosService.getUsuarios,
  });

  const createMut = useMutation({
    mutationFn: usuariosService.createUsuario,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['usuarios'] }); setModalOpen(false); },
  });

  const updateRolMut = useMutation({
    mutationFn: ({ id, rol }: { id: number; rol: string }) => usuariosService.updateUsuario(id, { rol }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['usuarios'] }); setEditingUser(null); },
  });

  if (isLoading) return <LoadingSpinner text="Cargando usuarios..." />;

  return (
    <div className="min-h-screen">
      <div className="px-4 md:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-start mb-8 animate-fadeInUp">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                👤 Usuarios
              </span>
            </h1>
            <p className="text-gray-500 text-lg">Gestiona los usuarios del sistema</p>
          </div>
          <button onClick={() => setModalOpen(true)}
            className="btn-primary text-base px-6 py-3">
            + Nuevo Usuario
          </button>
        </div>

        <div className="space-y-4 stagger">
          {usuarios?.length === 0 ? (
            <EmptyState icon="👤" title="No hay usuarios todavía" subtitle="Crea tu primer usuario para empezar" />
          ) : (
            usuarios?.map((u) => (
              <div key={u.id} className="card p-5 flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center text-lg font-bold text-amber-400 flex-shrink-0">
                    {u.nombre?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{u.nombre}</h3>
                    <p className="text-gray-400 text-sm">@{u.username} · {u.email}</p>
                    <span className={`inline-block mt-1.5 text-[10px] font-medium px-2.5 py-0.5 rounded-full ${rolBadge[u.rol?.toLowerCase()] || 'badge-gray'}`}>
                      {u.rol}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button onClick={() => setEditingUser({ id: u.id, username: u.username, nombre: u.nombre, rol: u.rol })}
                    className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors">
                    Editar rol
                  </button>
                  <p className="text-gray-500 text-sm">{new Date(u.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {modalOpen && (
          <UsuarioModal onClose={() => setModalOpen(false)} onSave={(data) => createMut.mutate(data)} />
        )}

        {editingUser && (
          <EditarRolModal
            username={editingUser.username}
            nombre={editingUser.nombre}
            rolActual={editingUser.rol}
            onClose={() => setEditingUser(null)}
            onSave={(rol) => updateRolMut.mutate({ id: editingUser.id, rol })}
          />
        )}
      </div>
    </div>
  );
}
