// External library
import useSWR from "swr";

// Infra
import Axios from "../../../infrastructure/http/axiosClient";

// Hooks
import { useAuth } from "@features/auth/hooks/useAuth";

// Types
import type { CardReview } from "../types";

// Guards
import { isLeft } from "@features/shared/errors/pattern/Either";

// Utils
import getRequestOptions from "@features/auth/utils/getRequestOptions";

interface HttpResponse {
  content: CardReview[];
}

export default function useGetReviewCard() {
  localStorage.removeItem("systematicReviewId");

  const result = useAuth();

  const user = !isLeft(result) ? result.value.user : null;
  const authLoading = !isLeft(result) ? result.value.isLoading : false;
  const authError = isLeft(result) ? result.value.message : null;

  const userId = user?.id ?? null;

  const path =
    !authLoading && userId
      ? `http://localhost:8080/api/v1/systematic-study/owner/${userId}`
      : null;

  const fetchAllCardReview = async () => {
    if (!path) return;
    try {
      const options = getRequestOptions();
      const response = await Axios.get<HttpResponse>(path, options);
      return response.data.content || [];
    } catch (error) {
      console.log("Error", error);
    }
  };

  const { data, isLoading, error, mutate } = useSWR(path, fetchAllCardReview, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });

  return {
    cardData: data,
    isLoaded: !isLoading,
    error: error || authError,
    mutate,
  };
}
