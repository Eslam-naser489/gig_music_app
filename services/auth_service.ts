import { apiClient } from "./api/api_client";
import { ApiUser, TokenPair } from "./api/apiTypes";

export const authService = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post<TokenPair>("/auth/login/", credentials, { skipAuth: true }),
  register: (userData: { username: string; email: string; password: string }) =>
    apiClient.post<ApiUser>("/auth/register/", userData, { skipAuth: true }),
  getMe: () => apiClient.get<ApiUser>("/auth/me/"),
};
