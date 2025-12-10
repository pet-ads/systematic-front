// External library
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Store
import { useAuthStore } from "@features/auth/store/useAuthStore";

// Services
import refresh from "@features/auth/services/refresh";

// Constants
import { ERROR_CODE } from "@features/shared/errors/constants/error";
import { isLeft } from "@features/shared/errors/pattern/Either";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 100000,
});

Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().user?.token;

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
      if (!config.headers["Content-Type"]) {
        config.headers.set("Content-Type", "application/json");
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response) {
      return Promise.reject(error); 
    }

    const { status } = error.response;

    const authCodes = [ERROR_CODE.unauthorized, ERROR_CODE.forbidden];

    if (authCodes.every((code) => code !== status) || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const result = await refresh();

      if (isLeft(result)) {
        useAuthStore.getState().logout();
        return Promise.reject(result.value);
      }

      const { accessToken } = result.value;

      useAuthStore.getState().updateToken(accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return Axios(originalRequest);
    } catch (err) {
      useAuthStore.getState().logout();
      return Promise.reject(err);
    }
  }
);

export default Axios;
