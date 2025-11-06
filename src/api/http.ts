// src/api/http.ts
import { useAppStore } from '@/stores/appStore'
import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para añadir el token automáticamente
http.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
})


http.interceptors.response.use(
  (response) => response,
  (error) => {
    const appStore = useAppStore();
    const message =
      error.response?.data?.message || "Error inesperado en el servidor";
    appStore.setError(message);
    // Evita que Axios lance el error al console
    return Promise.reject(error);
  }
);

export default http