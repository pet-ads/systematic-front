// External library
import useSWR from "swr";
import { useTranslation } from "react-i18next"; 
import { useEffect } from "react";

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

  useEffect(() => {
    localStorage.removeItem("systematicReviewId");
  }, []);

  const { user, _hasHydrated } = useAuthStore();

  const userId = user?.id ?? null;

  const path = _hasHydrated && userId ? "systematic-study" : null;

  const fetchAllCardReview = async () => {
    if (!path) return;
    try {
      const response = await Axios.get<HttpResponse>(path);
      const rawReviews = response.data.content || [];

      const enrichedReviews = await Promise.all(
        rawReviews.map(async (review) => {
          const collaboratorsResponse = await Axios.get<{
            invited: unknown[];
            collaborators: {
              id: string;
              username: string;
              email: string;
              role: string;
            }[];
          }>(`systematic-study/${review.id}/collaborators`);

          const collaborators = collaboratorsResponse.data.collaborators;

          const owner = collaborators.find((c) => c.role === "OWNER");

          const formattedCollaborators = collaborators
            .filter((c) => c.role !== "OWNER")
            .map((collaborator) => ({
              id: collaborator.id,
              username:
                collaborator.id === userId
                  ? t("you")
                  : collaborator.username,
              role: t(
                `review/planning-protocol:generalDefinition.input.researchers.role.${collaborator.role.toLowerCase()}`
              ),
            }));

          const ownerName = owner
            ? owner.id === userId
              ? t("you")
              : owner.username
            : "-";

          return {
            ...review,
            owner: ownerName,
            collaborators: formattedCollaborators,
          };
        })
      );

      return enrichedReviews;
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  };

  const { data, isLoading, error, mutate } = useSWR(
    path,
    fetchAllCardReview,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  );

  return {
    cardData: data,
    isLoaded: !isLoading,
    error,
    mutate,
  };
}