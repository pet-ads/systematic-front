// External library
import { useContext } from "react";

// Service
import Axios from "../../interceptor/interceptor";

// Context
import StudySelectionContext from "../../context/StudiesSelectionContext";

// Hooks
import useFocusedArticle from "../reviews/useFocusedArticle";

// Utils
import getRequestOptions from "../../utils/getRequestOptions";

// Types
import type { SendAnswerProps } from "../../pages/Execution/Extraction/subcomponents/forms/types";

export function useSendAnswerExtractionQuestions() {
  const selectionContext = useContext(StudySelectionContext);
  const { articleInFocus } = useFocusedArticle({ page: "Extraction" });

  const sendAnswerExtractionQuestions = async ({
    answers,
  }: SendAnswerProps) => {
    if (!articleInFocus || !selectionContext) {
      console.warn(
        "Context not available, cannot send answer from the question."
      );
      return;
    }
    try {
      const id = localStorage.getItem("systematicReviewId");
      const options = getRequestOptions();
      const path = `http://localhost:8080/api/v1/systematic-study/${id}/study-review/${articleInFocus.studyReviewId}/batch-extraction-answers`;
      await Axios.patch(
        path,
        {
          answers,
        },
        options
      );
      selectionContext.reloadArticles();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    sendAnswerExtractionQuestions,
  };
}
