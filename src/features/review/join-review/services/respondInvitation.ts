// External library
import { isAxiosError } from "axios";

// Infra
import Axios from "../../../../infrastructure/http/axiosClient";

// Factory
import errorFactory from "@features/shared/errors/factory/errorFactory";

// Error
import { type Either, right } from "@features/shared/errors/pattern/Either";
import { ApplicationError } from "@features/shared/errors/base/ApplicationError";

type InviteResponse = "ACCEPTED" | "REJECTED";

type Payload = {
  token: string;
  inviteResponse: InviteResponse;
};

export default async function respondInvitation(
  data: Payload
): Promise<Either<ApplicationError, Response>> {
  try {
    const { data: response } = await Axios.post(
      "systematic-study/respond-invitation",
      data
    );
    return right(response);
  } catch (error) {
    if (isAxiosError(error)) {
      return errorFactory("unauthorized", error.message);
    }

    if (error instanceof Error) {
      return errorFactory("custom", error.message);
    }

    return errorFactory("custom", "An unexpected error occurred.");
  }
}