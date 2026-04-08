// Infra
import Axios from "../../../infrastructure/http/axiosClient";

// Factory
import errorFactory from "@features/shared/errors/factory/errorFactory";

// Error
import { type Either, right } from "@features/shared/errors/pattern/Either";
import { ApplicationError } from "@features/shared/errors/base/ApplicationError";

// TYPES
type ForgotPasswordPayload = {
  email: string;
};

export default async function forgotPassword(
  data: ForgotPasswordPayload
): Promise<Either<ApplicationError, void>> {
  try {
    const { data: response } = await Axios.post(
      "auth/new-password-token",
      data
    );

    return right(response);
  } catch (error) {

    return errorFactory("custom", "We couldn't process your request right now. Please try again in a few moments.");
  }
}
