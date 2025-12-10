// External library
import useSWR from "swr";

// Service
import Axios from "../../../../infrastructure/http/axiosClient";

// Types
import type { TypeOfQuestions } from "../types";

type UseIncludedStudiesAnswersProps = {
  articleId: number;
};

export interface QuestionAnswer {
  questionId: string;
  code: string;
  type: TypeOfQuestions;
  description: string;
  answer: string | string[] | number | null;
}

export interface HttpResponse {
  includedBy: string[];
  extractionQuestions: QuestionAnswer[];
  robQuestions: QuestionAnswer[];
}

export default function useFetchIncludedStudiesAnswers({
  articleId,
}: UseIncludedStudiesAnswersProps) {
  const id = localStorage.getItem("systematicReviewId");

  const path = `systematic-study/${id}/report/${articleId}/included-studies-answers`;

  const { data, isLoading, mutate } = useSWR(path, fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });

  async function fetcher() {
    try {
      if (!id) return;
      const response = await Axios.get<HttpResponse>(path);
      return response.data;
    } catch (error) {
      console.error("Error fetching included studies answers", error);
      throw error;
    }
  }

  return {
    question: data,
    isLoading,
    mutate,
  };
}
