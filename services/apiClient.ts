import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiConfig } from '@/constants/api';

const ACCESS_TOKEN_KEY = 'gig_access_token';
const REFRESH_TOKEN_KEY = 'gig_refresh_token';

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

export const getStoredRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const saveRefreshToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch {
    // ignore storage errors
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
};

interface ApiResponse<T = any> {
  data: T;
  status: number;
}

// Bare fetch with no retry/refresh logic of its own — used both for normal
// requests and to call the refresh endpoint itself, so a failed refresh can
// never recurse back into the refresh flow.
async function rawRequest<T = any>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  body: any,
  token: string | null,
): Promise<ApiResponse<T>> {
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

// The access token is short-lived (~1 hour). Rather than let every screen
// fail with a 401 once it expires, refresh it once in the background and
// silently retry the original request. Concurrent 401s share one in-flight
// refresh instead of each firing their own refresh call.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await getStoredRefreshToken();
    if (!refreshToken) return null;

    try {
      const { data } = await rawRequest<{ access?: string; refresh?: string }>(
        'POST',
        '/auth/refresh/',
        { refresh: refreshToken },
        null,
      );
      if (!data?.access) return null;

      await saveToken(data.access);
      // Some backends rotate the refresh token on every use — keep it if sent.
      if (data.refresh) await saveRefreshToken(data.refresh);
      return data.access;
    } catch {
      // The refresh token itself is invalid/expired — there's no way to
      // recover silently. Clear everything so the app falls back to its
      // normal "logged out" state instead of retrying forever.
      await clearTokens();
      return null;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function request<T = any>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  body?: any,
  _isRetry = false,
): Promise<ApiResponse<T>> {
  const token = await getStoredToken();

  try {
    return await rawRequest<T>(method, url, body, token);
  } catch (error: any) {
    const status = error?.response?.status;

    // Only attempt one silent refresh-and-retry per request, and never for
    // the refresh call itself (that would recurse).
    if (status === 401 && !_isRetry && url !== '/auth/refresh/') {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return request<T>(method, url, body, true);
      }
    }

    throw error;
  }
}

export const apiClient = {
  get: <T = any>(url: string) => request<T>('GET', url),
  post: <T = any>(url: string, body?: any) => request<T>('POST', url, body),
  patch: <T = any>(url: string, body?: any) => request<T>('PATCH', url, body),
  delete: <T = any>(url: string, body?: any) => request<T>('DELETE', url, body),
};
