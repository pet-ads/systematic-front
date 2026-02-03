// External library
import { useContext } from "react";

// Service
import Axios from "../../../../infrastructure/http/axiosClient";

// Context
import StudyContext from "@features/review/shared/context/StudiesContext";

// Types
import type { SendAnswerProps } from "../types";

export function useSendBatchAnswers() {
  const studiesContext = useContext(StudyContext);

  const sendBatchAnswers = async ({ answers }: SendAnswerProps) => {
    if (!studiesContext) {
      console.warn(
        "Context not available, cannot send answer from the question."
      );
      return;
    }
    try {
      const id = localStorage.getItem("systematicReviewId");
      const path = `systematic-study/${id}/study-review/${studiesContext.selectedArticleReview}/batch-answer-question`;
      await Axios.patch(path, {
        answers,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return {
    sendBatchAnswers,
  };
}
