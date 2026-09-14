import { apiClient } from './apiClient';

export const authService = {
  register: async (data: any) => {
    const response = await apiClient.post('/auth/register/', data);
    return response.data;
  },
  login: async (data: any) => {
    const response = await apiClient.post('/auth/login/', data);
    return response.data;
  },
  refresh: async () => {
    const response = await apiClient.post('/auth/refresh/');
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get('/auth/me/');
    return response.data;
  },
};
