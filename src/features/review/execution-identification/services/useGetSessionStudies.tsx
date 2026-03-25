import useSWR from "swr";
import Axios from "../../../../infrastructure/http/axiosClient";
import ArticleInterface from "../../shared/types/ArticleInterface";
import { useMemo } from "react";

interface HttpResponse {
  studyReviews: ArticleInterface[];
  totalPages: number;
}

const useGetSessionStudies = (
  sessionId: string,
  page: number,
  size: number,
  sortConfig?: {
    key: keyof ArticleInterface | string;
    direction: "asc" | "desc";
  } | null,
) => {
  const reviewId = localStorage.getItem("systematicReviewId");
  const path = `systematic-study/${reviewId}/find-by-search-session/${sessionId}`;

  const swrKey = useMemo(() => {
    if (!sessionId) return null;
    return [path, page, size, sortConfig?.key, sortConfig?.direction];
  }, [sessionId, path, page, size, sortConfig?.key, sortConfig?.direction]);

  const { data, error, isLoading } = useSWR(swrKey, fetchArticlesSession, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    dedupingInterval: 5000,
    refreshInterval: 30000,
    keepPreviousData: true,
  });

  async function fetchArticlesSession() {
    try {
      interface FetchParams {
        page: number;
        size: number;
        sort?: string;
      }

      const params: FetchParams = {
        page,
        size,
      };

      if (sortConfig) {
        let backendKey = String(sortConfig.key);

        if (backendKey === "studyReviewId") {
          backendKey = "id";
        }

        params.sort = `${backendKey},${sortConfig.direction}`;
      }

      const response = await Axios.get<HttpResponse>(path, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching articles", error);
      throw error;
    }
  }

  return {
    articles: data?.studyReviews || [],
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
  };
};

export default useGetSessionStudies;
