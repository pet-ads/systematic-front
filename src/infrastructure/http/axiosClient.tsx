// External library
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Store
import { useAuthStore } from "@features/auth/store/useAuthStore";

// Services
import refresh from "@features/auth/services/refresh";

// Guards
import { isLeft } from "@features/shared/errors/pattern/Either";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 100000,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().user?.token;

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    if (!(config.data instanceof FormData)) {
      config.headers.set("Content-Type", "application/json");
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;

    if (!error.response) {
      return Promise.reject(error);
    }


    if (originalRequest.url?.includes("auth/refresh")) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    const user = useAuthStore.getState().user;

    if (status !== 401 || originalRequest._retry || !user) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.set(
              "Authorization",
              `Bearer ${token}`
            );
            resolve(Axios(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const result = await refresh();

      if (isLeft(result)) {
        processQueue(result.value, null);
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(result.value);
      }

      const { accessToken } = result.value;

      useAuthStore.getState().updateToken(accessToken);

      processQueue(null, accessToken);

      originalRequest.headers.set(
        "Authorization",
        `Bearer ${accessToken}`
      );

      return Axios(originalRequest);
    } catch (err) {
      processQueue(err, null);
      useAuthStore.getState().logout();
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default Axios;