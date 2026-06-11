// Service
import Axios from "../../../../infrastructure/http/axiosClient";

// Hooks
import useFocusedArticle from "../hooks/useFocusedArticle";
import { useContext } from "react";
import StudyContext from "../context/StudiesContext";

// Types
import type { PageLayout } from "../components/structure/LayoutFactory";

interface RevertCriterionStateProps {
  page: PageLayout;
}

interface HttpResponse {
  criteria: string[];
}

export default function useRevertCriterionState({
  page,
}: RevertCriterionStateProps) {
  const { articleInFocus } = useFocusedArticle({ page });
  const studiesContext = useContext(StudyContext);

  const articleId =
    articleInFocus?.studyReviewId ||
    studiesContext?.selectedArticleReview ||
    -1;

  const revertCriterionState = async (criteria: string[]) => {
    const id = localStorage.getItem("systematicReviewId");

    if (!id || articleId === -1) {
      console.warn("Invalid IDs, aborting revert silently to prevent UI crash.");
      return []; 
    }

    try {
      const path = `systematic-study/${id}/study-review/remove-criteria/${articleId}`;
      const response = await Axios.patch<HttpResponse>(path, { criteria });
      return response.data.criteria;
    } catch (error) {
      console.error("Failed to revert criterion state:", error);
      return criteria;
    }
  };

  return { revertCriterionState };
}