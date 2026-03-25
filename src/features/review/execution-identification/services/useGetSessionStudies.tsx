import useSWR from "swr";
import Axios from "../../../../infrastructure/http/axiosClient";

interface HttpResponse {
  studyReviews: ArticleInterface[];
  totalPages: number;
}

import ArticleInterface from "../../shared/types/ArticleInterface";
import { useMemo } from "react";

const useGetSessionStudies = (sessionId: string, page: number, size: number) => {
  const reviewId = localStorage.getItem("systematicReviewId");
  const path = `systematic-study/${reviewId}/find-by-search-session/${sessionId}`;

  const swrKey = useMemo(() => {
    if (!sessionId) return null;
    return [path, page, size];
  }, [sessionId, path, page, size]);

  const { data, error, isLoading } = useSWR(swrKey, fetchArticlesSession, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    dedupingInterval: 5000,
    refreshInterval: 30000,
    keepPreviousData: true,
  });
 
  async function fetchArticlesSession() {
    try {
      const response = await Axios.get<HttpResponse>(path, {
        params: {
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching articles", error);
      throw error;
    }
  }

  return { articles: data?.studyReviews || [], totalPages: data?.totalPages || 0 ,isLoading, error };
};

export default useGetSessionStudies;
