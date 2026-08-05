// import { useEffect, useState } from 'react';
import ArticleInterface from "../types/ArticleInterface";
import Axios from "../../../../infrastructure/http/axiosClient";

import useSWR from "swr";
import { StudyInterface } from "../types/IStudy";

interface HttpResponse {
  studyReviews: ArticleInterface[] | StudyInterface[];
}

const PAGE_SIZE = 100;

const useGetAllReviewArticles = () => {
  const id = localStorage.getItem("systematicReviewId");
  const { data, mutate, error, isLoading } = useSWR(
    `systematic-study/${id}/study-review`,
    fetchAllArticlesReview,
    {
      fallbackData: [],
      revalidateOnFocus: true,
      revalidateOnMount: true,
      dedupingInterval: 5000,
      refreshInterval: 30000,
    }
  );

  async function fetchAllArticlesReview() {
    try {
      const allArticles: (ArticleInterface | StudyInterface)[] = [];
      let page = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await Axios.get<HttpResponse>(
          `systematic-study/${id}/study-review`,
          { params: { page, size: PAGE_SIZE } }
        );

        const pageData = response.data.studyReviews || [];
        allArticles.push(...pageData);

        hasMore = pageData.length === PAGE_SIZE;
        page += 1;
      }

      return allArticles;
    } catch (error) {
      console.error("Error fetching articles", error);
      throw error;
    }
  }

  return { articles: data || [], mutate, error, isLoading };
};

export default useGetAllReviewArticles;
