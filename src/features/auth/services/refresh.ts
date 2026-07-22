// External library
import axios, { isAxiosError } from "axios";

// Factory
import errorFactory from "@features/shared/errors/factory/errorFactory";

// Error
import {
  type Either,
  right,
} from "@features/shared/errors/pattern/Either";

import { ApplicationError } from "@features/shared/errors/base/ApplicationError";

const RefreshAxios = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  withCredentials: true,
});

type RefreshResponse = {
  accessToken: string;
};

export default async function refresh(): Promise<
  Either<ApplicationError, RefreshResponse>
> {
  try {
    const { data } =
      await RefreshAxios.post<RefreshResponse>(
        "auth/refresh"
      );

    return right(data);
  } catch (error) {
    if (isAxiosError(error)) {
      return errorFactory(
        "unauthorized",
        error.response?.data?.message ||
          error.message
      );
    }

    return errorFactory(
      "custom",
      "Unexpected refresh error."
    );
  }
}