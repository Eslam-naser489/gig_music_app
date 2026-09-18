import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiConfig } from '@/constants/api';

const ACCESS_TOKEN_KEY = 'gig_access_token';

export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // ignore storage errors
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
};

interface ApiResponse<T = any> {
  data: T;
  status: number;
}

async function request<T = any>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  body?: any,
): Promise<ApiResponse<T>> {
  const token = await getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${ApiConfig.baseUrl}${url}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // The server returned something that isn't JSON (an HTML error page,
      // a maintenance page, etc). Keep a trimmed copy of it instead of
      // letting JSON.parse crash the whole request.
      data = { nonJsonBody: text.slice(0, 500) };
    }
  }

  if (!response.ok) {
    const error: any = new Error(`Request failed with status ${response.status}`);
    error.response = { status: response.status, data };
    throw error;
  }

  return { data: data as T, status: response.status };
}

export const apiClient = {
  get: <T = any>(url: string) => request<T>('GET', url),
  post: <T = any>(url: string, body?: any) => request<T>('POST', url, body),
  patch: <T = any>(url: string, body?: any) => request<T>('PATCH', url, body),
  delete: <T = any>(url: string, body?: any) => request<T>('DELETE', url, body),
};
