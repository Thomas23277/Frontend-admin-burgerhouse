import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  withCredentials: true,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de respuesta: transforma errores HTTP en errores estándar
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Error con respuesta del servidor (4xx, 5xx)
      const detail =
        error.response.data?.detail ??
        error.response.data?.message ??
        error.message ??
        'Error en la petición';
      return Promise.reject(new Error(detail));
    }

    // Error de red (servidor caído, timeout, etc.)
    if (error.request) {
      return Promise.reject(new Error('Error de conexión con el servidor'));
    }

    return Promise.reject(error);
  },
);

export default apiClient;
