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

interface CreateReviewInput extends GeneralDefinition {}

type CreateReviewOutput = {
  systematicStudyId: string;
};

interface UseCreateReviewOut {
  create: ({
    title,
    description,
    goal,
    collaborators,
  }: CreateReviewInput) => Promise<
    Either<ApplicationError, CreateReviewOutput>
  >;
}

export default function useCreateReview(): UseCreateReviewOut {
  async function create({
    title,
    description,
    goal,
    collaborators,
  }: CreateReviewInput): Promise<Either<ApplicationError, CreateReviewOutput>> {
    const data = { title, description, goal, collaborators };

    const options = getRequestOptions();

    try {
      const path = "http://localhost:8080/api/v1/systematic-study";
      const response = await Axios.post(path, data, options);
      return right({ systematicStudyId: response.data.systematicStudyId });
    } catch (error) {
      return errorFactory("database", (error as Error).message);
    }
  }

  return { create };
}
