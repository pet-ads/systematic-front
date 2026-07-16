// External library
import useSWR from "swr";

// Hooks
import useToaster from "@components/feedback/Toaster";

// Service
import Axios from "../../../../infrastructure/http/axiosClient";
import { PageLayout } from "../components/structure/LayoutFactory";

interface HttpResponse {
  inclusionCriteria: string[];
  exclusionCriteria: string[];
}

interface CriteriaForFocusedArticleProps {
  articleId: number;
  page: PageLayout
}

export default function useFetchCriteriaForFocusedArticle({
  articleId,
  page,
}: CriteriaForFocusedArticleProps) {
  const id = localStorage.getItem("systematicReviewId");
  const toast = useToaster();

  const path =
    id && articleId && articleId !== -1
      ? `systematic-study/${id}/report/study-review/${articleId}/criteria`
      : null;

  const { data, isLoading, error, mutate } = useSWR(
    path ? [path, articleId] : null,
    fetchAllCriteria,
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

  async function fetchAllCriteria() {
    try {
      if (!path) return;
      const response = await Axios.get<HttpResponse>(
        path,
        {
          params: {
            stage: page.toUpperCase()
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching criteria", error);
      throw error;
    }
  }

  return {
    criteria: data,
    mutate,
    isLoading,
    error,
  };
}
