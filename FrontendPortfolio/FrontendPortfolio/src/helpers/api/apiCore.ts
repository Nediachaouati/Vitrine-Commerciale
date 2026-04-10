import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import Keycloak from 'keycloak-js';
import config from '../../config';

// =======================================================
// 1) KEYCLOAK INSTANCE (unique)
// =======================================================
const keycloak = new Keycloak({
  url: config.KC_URL,
  realm: config.KC_REALM,
  clientId: config.KC_CLIENT_ID, // FRONT client
});

// =======================================================
// 2) AXIOS INSTANCE (avoid global interceptors stacking)
// =======================================================
const api: AxiosInstance = axios.create({
  baseURL: config.API_BK,
  timeout: 15000,
});

// =======================================================
// 3) TOKEN REFRESH SINGLE-FLIGHT
// =======================================================
let refreshPromise: Promise<string | null> | null = null;

async function ensureFreshToken(minValiditySeconds = 10): Promise<string | null> {
  if (!keycloak.authenticated) return null;

  // Un seul refresh à la fois
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      await keycloak.updateToken(minValiditySeconds);
      return keycloak.token ?? null;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Optionnel : refresh à l’expiration (sans storm)
keycloak.onTokenExpired = async () => {
  await ensureFreshToken(0);
};

// =======================================================
// 4) LOGIN SINGLE-FLIGHT (anti multi-redirect)
// =======================================================
let loginPromise: Promise<void> | null = null;

function loginOnce(redirectUri?: string) {
  if (loginPromise) return loginPromise;

  loginPromise = keycloak.login({ redirectUri: redirectUri ?? window.location.href }).finally(() => {
    loginPromise = null;
  });

  return loginPromise;
}

// =======================================================
// 5) REQUEST INTERCEPTOR
// =======================================================
api.interceptors.request.use(
  async (reqConfig) => {
    // Optionnel : éviter du bruit si tu as une page spéciale
    if (typeof window !== 'undefined' && window.location.pathname === '/unauthorized') {
      return reqConfig;
    }

    // Refresh seulement si token expire bientôt (10s)
    const token = await ensureFreshToken(10);
    if (token) {
      reqConfig.headers = reqConfig.headers ?? {};
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  },
  (error) => Promise.reject(error)
);

// =======================================================
// 6) RESPONSE INTERCEPTOR (401 retry once + login)
// =======================================================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (!status) return Promise.reject(error);

    // 403 => pas les droits (roles)
    if (status === 403) {
      window.location.href = '/access-denied';
      return Promise.reject(error);
    }

    // 401 => token invalide/expiré OU session perdue
    if (status === 401) {
      // Si un login est déjà en cours, on stop (anti relances)
      if (loginPromise) return loginPromise;

      const hasSession = !!keycloak.authenticated && !!keycloak.token;

      // Pas de session => login direct
      if (!hasSession) {
        return loginOnce(window.location.href);
      }

      // Retry unique
      if (originalRequest?._retry) {
        // Après 1 retry, on considère session KO => login (pas unauthorized)
        return loginOnce(window.location.href);
      }
      originalRequest._retry = true;

      // Tente refresh puis rejoue
      const newToken = await ensureFreshToken(0);
      if (newToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        (originalRequest.headers as any).Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      // Refresh impossible => login
      return loginOnce(window.location.href);
    }

    // Autres erreurs
    const message = (error.response?.data as any)?.message || error.message || 'Unknown error';
    return Promise.reject({ message, status });
  }
);

// =======================================================
// 7) API CORE CLASS
// =======================================================
class APICore {
  post = (url: string, data: any) => api.post(url, data);

  upload = (url: string, formData: any) => api.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

  uploadUpdate = (url: string, formData: any) => api.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

  get = (url: string, params?: any) => api.get(url, { params });

  getData = (url: string) => api.get(`${url}`);

  getById = (url: string, id: any) => api.get(`${url}/${id}`);

  deleteById = (url: string, id: any) => api.delete(`${url}/${id}`);

  Desactivate = (url: string, id: number) => api.put(`${url}/${id}`);

  putSimple = (url: string, data: any) => api.put(url, data);

  getFile = (url: string, params: any) => {
    if (params) {
      const queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      return api.get(`${url}?${queryString}`, { responseType: 'blob' });
    }
    return api.get(`${url}`, { responseType: 'blob' });
  };

  getMultiple = (urls: string[], params: any) => {
    let queryString = '';
    if (params) {
      queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    }
    return axios.all(urls.map((u) => api.get(`${u}?${queryString}`)));
  };

  create = (url: string, data: any) => api.post(url, data);

  updatePatch = (url: string, data: any) => api.patch(url, data);

  update = (url: string, data: any) => api.put(url, data);

  delete = (url: string) => api.delete(url);

  createWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) formData.append(k, data[k]);
    return api.post(url, formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
  };

  updateWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) formData.append(k, data[k]);
    return api.patch(url, formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
  };

  // Keycloak helpers
  isUserAuthenticated = () => !!keycloak.authenticated;

  getCurrentUserInfo = () => {
    const parsed: any = keycloak.tokenParsed || {};
    const firstName = parsed.given_name || parsed.firstName || '';
    const lastName = parsed.family_name || parsed.lastName || '';
    const username = parsed.preferred_username || parsed.username || '';

    const realmRoles: string[] = parsed?.realm_access?.roles || [];
    const apiClientId = config.KC_API_CLIENT_ID; // BACKEND client id
    const apiRoles: string[] = parsed?.resource_access?.[apiClientId]?.roles || [];

    return {
      id: parsed.sub,
      firstName,
      lastName,
      username,
      email: parsed.email,
      roles: [...realmRoles, ...apiRoles],
    };
  };

  logout = () => keycloak.logout();
}

// =======================================================
// 8) EXPORTS
// =======================================================
export { APICore, keycloak };
