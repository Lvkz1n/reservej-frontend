const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
  auth?: boolean;
  companyId?: string | null;
  signal?: AbortSignal;
  retry?: boolean;
};

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

let tokens: AuthTokens | null = null;
let companyContext: string | null = null;
let onUnauthorized: (() => void) | null = null;
let onTokenChange: ((tokens: AuthTokens | null) => void) | null = null;
let refreshPromise: Promise<AuthTokens | null> | null = null;

const normalizeTokens = (payload: any): AuthTokens | null => {
  const accessToken = payload?.access_token ?? payload?.accessToken;
  const refreshToken = payload?.refresh_token ?? payload?.refreshToken;

  if (!accessToken || !refreshToken) return null;

  return {
    accessToken,
    refreshToken,
  };
};

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  const hasJson = contentType?.includes("application/json");
  const data = hasJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(response.status, (data as any)?.message ?? response.statusText, data);
  }

  return data;
};

const refreshTokens = async () => {
  if (!tokens?.refreshToken) return null;
  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  })
    .then(handleResponse)
    .then((data) => {
      const nextTokens = normalizeTokens(data);
      if (!nextTokens) {
        throw new Error("Refresh response sem tokens");
      }
      setAuthTokens(nextTokens);
      return nextTokens;
    })
    .catch((error) => {
      setAuthTokens(null);
      onUnauthorized?.();
      console.error("Erro ao renovar token", error);
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

export const setAuthTokens = (nextTokens: AuthTokens | null) => {
  tokens = nextTokens;
  onTokenChange?.(nextTokens);
};

export const setCompanyContext = (companyId: string | null) => {
  companyContext = companyId;
};

export const setAuthHandlers = (handlers: {
  onUnauthorized?: () => void;
  onTokenChange?: (tokens: AuthTokens | null) => void;
}) => {
  onUnauthorized = handlers.onUnauthorized ?? onUnauthorized;
  onTokenChange = handlers.onTokenChange ?? onTokenChange;
};

export const apiFetch = async <T = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const {
    method = "GET",
    body,
    headers = {},
    auth = true,
    companyId,
    signal,
    retry = true,
  } = options;

  const finalHeaders = new Headers(headers);
  let payload = body as BodyInit | undefined;

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders.set("Content-Type", "application/json");
    payload = JSON.stringify(body);
  }

  if (auth && tokens?.accessToken) {
    finalHeaders.set("Authorization", `Bearer ${tokens.accessToken}`);
  }

  const companyHeader = companyId ?? companyContext;
  if (auth && companyHeader) {
    finalHeaders.set("X-Company-Id", companyHeader);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: payload,
    signal,
  });

  if (response.status === 401 && auth && retry && tokens?.refreshToken) {
    const refreshed = await refreshTokens();
    if (refreshed?.accessToken) {
      return apiFetch<T>(path, { ...options, retry: false });
    }
  }

  return handleResponse(response) as Promise<T>;
};

export const apiClient = {
  get: <T>(path: string, options?: Omit<ApiRequestOptions, "method">) =>
    apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<ApiRequestOptions, "method">) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};

export { API_BASE_URL, ApiError };
