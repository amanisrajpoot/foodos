import axios from 'axios';

// The backend URL will come from environment variables in the future
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We will add interceptors for auth tokens here in Phase 1
api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
