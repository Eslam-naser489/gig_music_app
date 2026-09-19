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
  // Not called directly anymore — apiClient refreshes the access token
  // internally (see services/apiClient.ts) whenever a request gets a 401.
  // Left here in case another screen wants to trigger a refresh manually.
  refresh: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh/', { refresh: refreshToken });
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get('/auth/me/');
    return response.data;
  },
};
