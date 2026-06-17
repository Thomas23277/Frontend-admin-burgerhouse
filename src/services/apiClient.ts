import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  withCredentials: true,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Interceptor 401: refresh automático + transformación de errores ──
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ── Transformar error HTTP a mensaje legible (si no podemos reintentar) ──
    if (error.response?.status !== 401 || originalRequest?._retry) {
      if (error.response) {
        const detail =
          error.response.data?.detail ??
          error.response.data?.message ??
          error.message ??
          'Error en la petición';
        return Promise.reject(new Error(detail));
      }
      if (error.request) {
        return Promise.reject(new Error('Error de conexión con el servidor'));
      }
      return Promise.reject(error);
    }

    // Si es la request de refresh, no reintentar para evitar loop
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // Si ya hay un refresh en curso, encolar esta request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        return apiClient(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      await axios.post(
        `${apiClient.defaults.baseURL}/auth/refresh`,
        {},
        { withCredentials: true },
      );
      processQueue(null);
      return apiClient(originalRequest);
    } catch {
      processQueue(error);
      // Si el refresh falló, logout
      const { useAuthStore } = await import('../store/authStore');
      useAuthStore.getState().logout();
      return Promise.reject(new Error('Sesión expirada. Iniciá sesión de nuevo.'));
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
