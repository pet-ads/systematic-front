import useSWR from "swr";
import Axios from "../../../../infrastructure/http/axiosClient";

interface HttpResponse {
  studyReviews: ArticleInterface[];
}

import ArticleInterface from "../../shared/types/ArticleInterface";

const useGetSessionStudies = (sessionId: string, page: number, size: number) => {
  const reviewId = localStorage.getItem("systematicReviewId");
  const path = `systematic-study/${reviewId}/find-by-search-session/${sessionId}`;

  const { data, error, isLoading } = useSWR([path, page], fetchArticlesSession, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    dedupingInterval: 5000,
    refreshInterval: 30000,
  });

  async function fetchArticlesSession() {
    try {
      const response = await Axios.get<HttpResponse>(path, {
        params: {
          page,
          size,
        },
      });
      return response.data.studyReviews;
    } catch (error) {
      console.error("Error fetching articles", error);
      throw error;
    }
  }

  return { articles: data || [], isLoading, error };
};

export default useGetSessionStudies;
