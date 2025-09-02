// Infra
import Axios from "../../../../infrastructure/http/axiosClient";

// Error
import { ApplicationError } from "@features/shared/errors/base/ApplicationError";

// Guards
import { type Either, right } from "@features/shared/errors/pattern/Either";

// Factory
import errorFactory from "@features/shared/errors/factory/errorFactory";

// Utils
import getRequestOptions from "@features/auth/utils/getRequestOptions";

// Types
import type { GeneralDefinition } from "../pages/GeneralDefinition/types";

interface UseUpdateReviewOutput {
  update: ({
    title,
    description,
    goal,
  }: UpdateReviewInput) => Promise<
    Either<ApplicationError, UpdateReviewOutput>
  >;
}

interface UpdateReviewInput extends Omit<GeneralDefinition, "collaborators"> {
  systematicStudyId: string;
}

type UpdateReviewOutput = {
  systematicStudyId: string;
};

export default function useUpdateReview(): UseUpdateReviewOutput {
  async function update({
    systematicStudyId: id,
    title,
    description,
    goal,
  }: UpdateReviewInput): Promise<Either<ApplicationError, UpdateReviewOutput>> {
    const data = { title, description, goal };

    const options = getRequestOptions();

    try {
      const path = `http://localhost:8080/api/v1/systematic-study/${id}`;

      const response = await Axios.put(path, data, options);
      return right({ systematicStudyId: response.data.systematicStudyId });
    } catch (error) {
      return errorFactory("database", (error as Error).message);
    }
  }

  return { update };
}
