import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';

export const apiClient = axios.create({
  baseURL: `${apiBase}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for AI / ML inference and RAG generation
});

export default apiClient;
