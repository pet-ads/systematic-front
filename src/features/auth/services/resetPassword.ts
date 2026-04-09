// Infra
import Axios from "../../../infrastructure/http/axiosClient";

// Factory
import errorFactory from "@features/shared/errors/factory/errorFactory";

// Error
import { type Either, right } from "@features/shared/errors/pattern/Either";
import { ApplicationError } from "@features/shared/errors/base/ApplicationError";

// TYPES
type ResetPasswordPayload = {
  token: string;
  senha: string;
};

export default async function resetPassword(
  data: ResetPasswordPayload
): Promise<Either<ApplicationError, void>> {
  try {
    const { data: response } = await Axios.post(
      "auth/new-password",
      data
    );

    return right(response);
  } catch (error) {
      if (error instanceof Error) {
        return errorFactory("custom", error.message);
      }

      return errorFactory("custom", "Invalid token!");
  }
}
