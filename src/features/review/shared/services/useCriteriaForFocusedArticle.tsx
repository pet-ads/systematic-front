// External library
import useSWR from "swr";

// Hooks
import useToaster from "@components/feedback/Toaster";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import useFetchExclusionCriteria from "./useFetchExclusionCriterias";
import useFetchInclusionCriteria from "./useFetchInclusionCriteria";

// Service
import Axios from "../../../../infrastructure/http/axiosClient";
import type { PageLayout } from "../components/structure/LayoutFactory";

interface ReviewerCriteriaResponse {
  selectionCriteria?: string[] | null;
  extractionCriteria?: string[] | null;
}

interface ArticleCriteria {
  inclusionCriteria: string[];
  exclusionCriteria: string[];
}

interface CriteriaForFocusedArticleProps {
  articleId: number;
  page: PageLayout;
}

export default function useFetchCriteriaForFocusedArticle({
  articleId,
  page,
}: CriteriaForFocusedArticleProps) {
  const systematicStudy = localStorage.getItem("systematicReviewId");
  const { user } = useAuthStore();
  const reviewerId = user?.id;
  const inclusion = useFetchInclusionCriteria() || [];
  const exclusion = useFetchExclusionCriteria() || [];
  const toast = useToaster();

  const path =
    systematicStudy && reviewerId && articleId !== -1
      ? `systematic-study/${systematicStudy}/study-review/reviewer/${reviewerId}/${articleId}`
      : null;

  const { data, isLoading, error, mutate } = useSWR<ReviewerCriteriaResponse>(
    path,
    fetchReviewerCriteria,
    {
      revalidateOnFocus: false,
      keepPreviousData: false,
      onError: () => {
        toast({
          title: "Erro ao carregar critérios",
          description:
            "Não foi possível buscar os critérios deste artigo. Os dados exibidos podem estar desatualizados.",
          status: "error",
        });
      },
    }
  );

  async function fetchReviewerCriteria(requestPath: string) {
    try {
      const response = await Axios.get<ReviewerCriteriaResponse>(requestPath);
      return response.data;
    } catch (error) {
      console.error("Error fetching reviewer criteria", error);
      throw error;
    }
  }

  const reviewerCriteria = {
    selectionCriteria: data?.selectionCriteria ?? [],
    extractionCriteria: data?.extractionCriteria ?? [],
  };
  const selectedCriteria =
    page === "Selection"
      ? reviewerCriteria.selectionCriteria
      : reviewerCriteria.extractionCriteria;
  const criteria: ArticleCriteria = {
    inclusionCriteria: inclusion.filter((criterion) =>
      selectedCriteria.includes(criterion),
    ),
    exclusionCriteria: exclusion.filter((criterion) =>
      selectedCriteria.includes(criterion),
    ),
  };

  return {
    criteria,
    reviewerCriteria: data ? reviewerCriteria : undefined,
    inclusion,
    exclusion,
    mutate,
    isLoading,
    error,
  };
}
