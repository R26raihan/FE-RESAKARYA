import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for AI / ML inference and RAG generation
});

export default apiClient;
