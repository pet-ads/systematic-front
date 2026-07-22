// External library
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Store
import { useAuthStore } from "@features/auth/store/useAuthStore";

// Services
import refresh from "@features/auth/services/refresh";

// Guards
import { isLeft } from "@features/shared/errors/pattern/Either";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

function redirectToLogin() {
  window.location.href =
    "/?showModal=login";
}

const processQueue = (
  error: unknown,
  token?: string
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

Axios.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig
  ) => {
    const token =
      useAuthStore.getState().user?.token;

    if (token) {
      config.headers.set(
        "Authorization",
        `Bearer ${token}`
      );
    }

    return config;
  }
);

Axios.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    const status =
      error.response?.status;

    const user =
      useAuthStore.getState().user;

    if (
      status !== 401 ||
      originalRequest._retry ||
      !user
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise(
        (resolve, reject) => {
          failedQueue.push({
            resolve: (
              token: string
            ) => {
              originalRequest.headers.set(
                "Authorization",
                `Bearer ${token}`
              );

              resolve(
                Axios(originalRequest)
              );
            },

            reject,
          });
        }
      );
    }

    originalRequest._retry = true;

    isRefreshing = true;

    try {
      const result = await refresh();

      if (isLeft(result)) {
        processQueue(result.value);

        await useAuthStore
          .getState()
          .logout();

        redirectToLogin();

        return Promise.reject(
          result.value
        );
      }

      const token =
        result.value.accessToken;

      useAuthStore
        .getState()
        .updateToken(token);

      processQueue(null, token);

      originalRequest.headers.set(
        "Authorization",
        `Bearer ${token}`
      );

      return Axios(originalRequest);
    } catch (err) {
      processQueue(err);

      await useAuthStore
        .getState()
        .logout();

      redirectToLogin();

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default Axios;