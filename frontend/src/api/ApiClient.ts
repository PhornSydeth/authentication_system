import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * Used only for POST /refresh-token so we never attach the auth response interceptor
 * to the refresh call itself (avoids infinite 401 → refresh loops).
 */
const refreshClient = axios.create({
    baseURL,
    withCredentials: true,
});

export const ApiClient = axios.create({
    baseURL,
    withCredentials: true,
});

/** Endpoints where 401 must not trigger refresh (wrong password, etc.). */
const NO_REFRESH_ON_401 = ["/login", "/register", "/verify-email", "/refresh-token", "/send", "/changePass"];

function shouldSkipRefresh(config: InternalAxiosRequestConfig): boolean {
    const url = config.url ?? "";
    return NO_REFRESH_ON_401.some((segment) => url.includes(segment));
}

type ConfigWithRetry = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<void> | null = null;

/**
 * Calls backend POST /refresh-token (refreshToken HttpOnly cookie).
 * Concurrent callers share one in-flight refresh.
 */
export function refreshAccessToken(): Promise<void> {
    if (!refreshPromise) {
        refreshPromise = refreshClient
            .post("/refresh-token")
            .then(() => undefined)
            .catch((err) => {
                throw err;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

ApiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original = error.config as ConfigWithRetry | undefined;

        if (!original || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        if (original._retry || shouldSkipRefresh(original)) {
            return Promise.reject(error);
        }

        original._retry = true;

        try {
            await refreshAccessToken();
            return ApiClient(original);
        } catch {
            return Promise.reject(error);
        }
    }
);
