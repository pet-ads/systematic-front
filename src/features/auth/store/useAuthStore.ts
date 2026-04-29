// External library
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Hooks
import useDecodeToken from "@features/auth/hooks/useDecodeToken";

// Services
import loginService from "@features/auth/services/login";
import logoutService from "@features/auth/services/logout";

// Factory
import errorFactory from "@features/shared/errors/factory/errorFactory";

// Error
import type { Either } from "@features/shared/errors/pattern/Either";
import { ApplicationError } from "@features/shared/errors/base/ApplicationError";

// Guards
import { isLeft, right } from "@features/shared/errors/pattern/Either";

// Types
import type { AccessCredentials, UserData } from "@features/auth/types";

// Types
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

const { checkTokenExpiration, decodeToken } = useDecodeToken();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      _hasHydrated: false,

      setHasHydrated: (value) => {
        set({ _hasHydrated: value });
      },

      updateToken: (newToken: string) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: { ...currentUser, token: newToken },
        });
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const result = await loginService(credentials);

          if (isLeft(result)) {
            return result;
          }

          const { accessToken: token } = result.value;
          const decoded = decodeToken(token);

          if (!checkTokenExpiration(decoded)) {
            return errorFactory("unauthorized", "Expires token.");
          }

          const { id, ...rest } = decoded;
          const userData = { ...rest, token, id };

          set({ user: userData });
          return right(undefined);
        } catch (error) {
          return errorFactory(
            "custom",
            "An unexpected error occurred in the login flow."
          );
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await logoutService();
        set({ user: null });
      },
    }),
    {
      name: "auth-user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),

      onRehydrateStorage: () => (state) => {

        if (!state) {
          useAuthStore.setState({ _hasHydrated: true, isLoading: false });
          return;
        }

        useAuthStore.setState({
          _hasHydrated: true,
          isLoading: false,
        });
      }
    }
  )
);

useAuthStore.getState().setHasHydrated(true);