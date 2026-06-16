import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface UiState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

let toastCounter = 0;

export const useUiStore = create<UiState>((set, get) => ({
  sidebarOpen: false,
  toasts: [],

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  addToast: ({ message, type, duration = 4000 }) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type, duration }] }));

    // Auto-remover después de la duración
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  clearToasts: () => set({ toasts: [] }),
}));
