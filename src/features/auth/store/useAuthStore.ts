// External library
import { create } from "zustand";

import {
  persist,
  createJSONStorage,
} from "zustand/middleware";

// Hooks
import useDecodeToken from "@features/auth/hooks/useDecodeToken";

// Services
import loginService from "@features/auth/services/login";

import logoutService from "@features/auth/services/logout";

import refresh from "@features/auth/services/refresh";

// Factory
import errorFactory from "@features/shared/errors/factory/errorFactory";

// Error
import type { Either } from "@features/shared/errors/pattern/Either";

import { ApplicationError } from "@features/shared/errors/base/ApplicationError";

// Guards
import {
  isLeft,
  right,
} from "@features/shared/errors/pattern/Either";

// Types
import type {
  AccessCredentials,
  UserData,
} from "@features/auth/types";

interface AuthState {
  user: UserData | null;

  isLoading: boolean;

  login: (
    credentials: AccessCredentials
  ) => Promise<Either<ApplicationError, void>>;

  logout: () => Promise<void>;

  _hasHydrated: boolean;

  setHasHydrated: (value: boolean) => void;

  updateToken: (newToken: string) => void;
}

const {
  checkTokenExpiration,
  decodeToken,
} = useDecodeToken();

let refreshTimer: ReturnType<
  typeof setTimeout
> | null = null;

function redirectToLogin() {
  window.location.href =
    "/?showModal=login";
}

function scheduleRefresh(
  token: string,
  updateToken: (token: string) => void,
  logout: () => Promise<void>
) {
  const decoded = decodeToken(token);

  const expiresAt = decoded.exp * 1000;

  const now = Date.now();

  const timeout = expiresAt - now;

  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  if (timeout <= 0) {
    return;
  }

  refreshTimer = setTimeout(async () => {
    try {
      const result = await refresh();

      if (isLeft(result)) {
        await logout();

        redirectToLogin();

        return;
      }

      updateToken(result.value.accessToken);
    } catch {
      await logout();

      redirectToLogin();
    }
  }, timeout);
}

export const useAuthStore =
  create<AuthState>()(
    persist(
      (set, get) => ({
        user: null,

        isLoading: true,

        _hasHydrated: false,

        setHasHydrated: (value) => {
          set({
            _hasHydrated: value,
          });
        },

        updateToken: (newToken: string) => {
          const currentUser =
            get().user;

          if (!currentUser) return;

          const decoded =
            decodeToken(newToken);

          scheduleRefresh(
            newToken,
            get().updateToken,
            get().logout
          );

          set({
            user: {
              ...currentUser,
              ...decoded,
              token: newToken,
            },
          });
        },

        login: async (credentials) => {
          set({
            isLoading: true,
          });

          try {
            const result =
              await loginService(
                credentials
              );

            if (isLeft(result)) {
              return result;
            }

            const {
              accessToken: token,
            } = result.value;

            const decoded =
              decodeToken(token);

            if (
              !checkTokenExpiration(
                decoded
              )
            ) {
              return errorFactory(
                "unauthorized",
                "Expired token."
              );
            }

            const { id, ...rest } =
              decoded;

            const userData = {
              ...rest,
              token,
              id,
            };

            scheduleRefresh(
              token,
              get().updateToken,
              get().logout
            );

            set({
              user: userData,
            });

            return right(undefined);
          } catch {
            return errorFactory(
              "custom",
              "An unexpected error occurred in the login flow."
            );
          } finally {
            set({
              isLoading: false,
            });
          }
        },

        logout: async () => {
          if (refreshTimer) {
            clearTimeout(
              refreshTimer
            );

            refreshTimer = null;
          }

          try {
            await logoutService();
          } finally {
            set({
              user: null,
            });
          }
        },
      }),
      {
        name: "auth-user-storage",

        storage: createJSONStorage(
          () => localStorage
        ),

        partialize: (state) => ({
          user: state.user,
        }),

        onRehydrateStorage:
          () => (state) => {
            if (!state) {
              useAuthStore.setState({
                _hasHydrated: true,
                isLoading: false,
              });

              return;
            }

            useAuthStore.setState({
              _hasHydrated: true,
              isLoading: false,
            });

            const user = state.user;

            if (!user) return;

            const decoded =
              decodeToken(user.token);

            if (
              decoded.exp * 1000 <=
              Date.now()
            ) {
              useAuthStore
                .getState()
                .logout();

              redirectToLogin();

              return;
            }

            scheduleRefresh(
              user.token,
              useAuthStore
                .getState()
                .updateToken,
              useAuthStore
                .getState()
                .logout
            );
          },
      }
    )
  );

useAuthStore
  .getState()
  .setHasHydrated(true);