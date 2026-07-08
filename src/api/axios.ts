// src/api/axios.ts
import axios from 'axios';

// Vite usa import.meta.env para leer las variables del .env
// Si por alguna razón no encuentra el .env, usa localhost por defecto
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL, 
});

// Interceptor para inyectar el Token en cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;