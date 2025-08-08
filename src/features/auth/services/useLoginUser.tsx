// Service
import Axios from "../../../infrastructure/http/axiosClient";

// Factory
import errorFactory from "@features/shared/errors/factory/errorFactory";

// Types
import { HateoasLinks } from "@features/shared/types/hateoas";
import { AccessCredentials } from "../types";

type LoginUserOutput = {
  accessToken: string;
  _links: HateoasLinks;
};

export default async function useLoginUser(data: AccessCredentials) {
  try {
    const response = await Axios.post<LoginUserOutput>(
      "http://localhost:8080/api/v1/auth",
      data,
      {
        withCredentials: true,
      }
    );
    localStorage.setItem("accessToken", response.data.accessToken);
    return response;
  } catch (error) {
    errorFactory("unauthorized", (error as Error).message);
  }
}
