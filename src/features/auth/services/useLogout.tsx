// Infra
import Axios from "../../../infrastructure/http/axiosClient";

// Error
import type { Either } from "@features/shared/errors/pattern/Either";
import { ApplicationError } from "@features/shared/errors/base/ApplicationError";

// Utils
import { userStorage } from "../utils/userStorage";

// Factory
import errorFactory from "@features/shared/errors/factory/errorFactory";

// Guard
import { right } from "@features/shared/errors/pattern/Either";

export default async function useLogout(): Promise<
  Either<ApplicationError, void>
> {
  try {
    await Axios.post(
      "http://localhost:8080/api/v1/auth/logout",
      {},
      { withCredentials: true }
    );
    userStorage.clear();
    return right(undefined);
  } catch (error) {
    return errorFactory("custom", "Error logging out.");
  }
}
