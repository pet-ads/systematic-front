// External library
import { createContext, ReactNode, useEffect, useState } from "react";

// Hooks
import useDecodeToken from "@features/auth/hooks/useDecodeToken";

// Services
import loginService from "@features/auth/services/useLoginUser";
import logoutService from "@features/auth/services/useLogout";

// Utils
import { userStorage } from "@features/auth/utils/userStorage";

// Factory
import errorFactory from "@features/shared/errors/factory/errorFactory";

// Error
import type { Either } from "@features/shared/errors/pattern/Either";
import { ApplicationError } from "@features/shared/errors/base/ApplicationError";

// Guards
import { isLeft, right } from "@features/shared/errors/pattern/Either";

// Types
import type { AccessCredentials, UserData } from "@features/auth/types";

export interface AuthContextProps {
  user: UserData | null;
  isLoading: boolean;
  login: (
    credentials: AccessCredentials
  ) => Promise<Either<ApplicationError, void>>;
  logout: () => Promise<Either<ApplicationError, void>>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { decodeToken, checkTokenExpiration } = useDecodeToken();

  const initialize = (): Either<ApplicationError, UserData> => {
    setIsLoading(true);
    const restoreUserData = userStorage.get();

    if (isLeft(restoreUserData)) {
      setIsLoading(false);
      return restoreUserData;
    }

    const userData: UserData = restoreUserData.value;

    if (!checkTokenExpiration(userData)) {
      setIsLoading(false);
      return errorFactory("unauthorized", "Token expired.");
    }

    return right(userData);
  };

  useEffect(() => {
    const restoredUser = initialize();

    if (isLeft(restoredUser)) {
      logout();
      setIsLoading(false);
      return;
    }

    setUser(restoredUser.value);
    setIsLoading(false);
  }, []);

  const login = async (
    credentials: AccessCredentials
  ): Promise<Either<ApplicationError, void>> => {
    try {
      const response = await loginService(credentials);

      if (!response || !response.data) {
        return errorFactory("custom", "Request is empty.");
      }

      const { accessToken: token } = response.data;

      if (!token) {
        return errorFactory("unauthorized", "Token not found.");
      }

      const decoded = decodeToken(token);

      if (!checkTokenExpiration(decoded)) {
        return errorFactory("unauthorized", "Expires Token.");
      }

      const { id, ...rest } = decoded;

      const userData = {
        ...rest,
        token,
      };

      userStorage.set(userData);
      setUser({
        ...userData,
        id,
      });

      return right(undefined);
    } catch (error) {
      return errorFactory(
        "unauthorized",
        "Username or password incorrect. Try again with other credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<Either<ApplicationError, void>> => {
    try {
      await logoutService();
      setUser(null);
      return right(undefined);
    } catch (error) {
      return errorFactory("custom", "Erro ao fazer logout.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
