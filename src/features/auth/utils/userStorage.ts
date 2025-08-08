// External library
import type { UserData } from "@features/auth/types";

// Error
import { Either, right } from "@features/shared/errors/pattern/Either";
import { ApplicationError } from "@features/shared/errors/base/ApplicationError";
import errorFactory from "@features/shared/errors/factory/errorFactory";

// Constants
const USER_KEY = "user";
const TOKEN_KEY = "accessToken";

// Types
interface UserStorageProps {
  get: () => Either<ApplicationError, UserData>;
  set: (data: Omit<UserData, "id">) => void;
  clear: () => void;
}

export const userStorage: UserStorageProps = {
  get: (): Either<ApplicationError, UserData> => {
    const data = localStorage.getItem(USER_KEY);

    if (!data) {
      return errorFactory("not_found", "User data not found in storage.");
    }

    try {
      const parsed = JSON.parse(data);
      return right(parsed);
    } catch (error) {
      return errorFactory("custom", "Failed to parse user data.");
    }
  },
  set: (data: Omit<UserData, "id">) => {
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    localStorage.setItem(TOKEN_KEY, data.token);
  },
  clear: () => {
    localStorage.clear();
  },
};
