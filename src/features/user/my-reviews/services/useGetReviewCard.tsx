// External library
import useSWR from "swr";
import { useTranslation } from "react-i18next"; 

// Infra
import Axios from "../../../../infrastructure/http/axiosClient";

// Hooks
import { useAuthStore } from "@features/auth/store/useAuthStore";

// Types
import type { CardReview } from "../types";

interface HttpResponse {
  content: CardReview[];
}

export default function useGetReviewCard() {
  const { t } = useTranslation("user/my-reviews");
  
  localStorage.removeItem("systematicReviewId");

  const { user, isLoading: authLoading } = useAuthStore();

  const userId = user?.id ?? null;

  const path = !authLoading && userId ? "systematic-study" : null;

  const fetchAllCardReview = async () => {
    if (!path) return;
    try {
      const response = await Axios.get<HttpResponse>(path);
      const rawReviews = response.data.content || [];

      const enrichedReviews = rawReviews.map((review) => {
        const formattedCollaborators = review.collaborators.map((uuid) => {
          
          if (uuid === userId) {
            return `${t("you")} - ${t("reviewerRole")}`;
          }
          
          return `${t("reviewerRole")} (${uuid})`;
        });

        return {
          ...review,
          collaborators: formattedCollaborators,
        };
      });

      return enrichedReviews;
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  };

  const { data, isLoading, error, mutate } = useSWR(path, fetchAllCardReview, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });

  return {
    cardData: data,
    isLoaded: !isLoading,
    error: error,
    mutate,
  };
}
