import axios from 'axios';

// Live Vercel API URL fallback
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://foodos-pfl0o3qfc-amanisrajpoots-projects.vercel.app/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  return config;
});

import { useToastStore } from '../stores/toast.store';

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Determine a user-friendly error message
    let message = 'An unexpected error occurred while communicating with the server.';
    let title = 'Network Error';

    if (error.response) {
      title = `Server Error (${error.response.status})`;
      message = error.response.data?.message || message;
    } else if (error.request) {
      title = 'Connection Timeout';
      message = 'Could not reach the server. Please check your internet connection.';
    }

    // Dispatch to global toast store
    useToastStore.getState().addToast({
      type: 'error',
      title,
      message,
    });

    return Promise.reject(error);
  }
);
