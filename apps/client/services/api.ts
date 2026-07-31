import axios from 'axios';

// Live Vercel API URL fallback
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api-amanisrajpoots-projects.vercel.app';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
