// External libraries
import { useContext } from "react";
import useToaster from "@components/feedback/Toaster";

// Context
import StudySelectionContext from "@features/review/shared/context/StudiesSelectionContext";

// Hooks
import { useSendBatchAnswers } from "./useSendBatchAnswers";
import { UseChangeStudyExtractionStatus } from "../../shared/services/useChangeStudyExtractionStatus";
import useFocusedArticle from "../../shared/hooks/useFocusedArticle";

// Types
import type { AnswerStrucuture, ArticleAnswerStrucuture } from "../types";

interface UseFormSubmissionProps {
  responses: ArticleAnswerStrucuture;
  onQuestionsMutated: () => void;
}

export function useExtractionFormSubmission({
  responses,
  onQuestionsMutated,
}: UseFormSubmissionProps) {
  const toast = useToaster();
  const selectionContext = useContext(StudySelectionContext);
  const { articleInFocus } = useFocusedArticle({ page: "Extraction" });
  const { sendBatchAnswers } = useSendBatchAnswers();

  const { extractionQuestions, robQuestions } = responses;

  const hasIncompleteAnswers = (answers: AnswerStrucuture[]): boolean =>
    answers.some(
      (answer) =>
        !answer.answer ||
        answer.answer.value === "" ||
        answer.answer.value == null
    );

  const mapAnswersToPayload = (answers: AnswerStrucuture[]) =>
    answers.map((answer) => ({
      answer:
        answer.type === "NUMBERED_SCALE"
          ? Number(answer.answer.value)
          : answer.answer.value,
      questionId: answer.questionId,
      type: answer.type,
    }));

  const updateStudyStatus = async () => {
    if (!articleInFocus || !selectionContext) return;
    if (articleInFocus.extractionStatus !== "UNCLASSIFIED") return;
    UseChangeStudyExtractionStatus({
      studyReviewId: [selectionContext.selectedArticleReview],
      criterias: [],
      status: "INCLUDED",
    });
  };

  const submitResponses = async () => {
    const combinedAnswers = [...extractionQuestions, ...robQuestions];

    if (hasIncompleteAnswers(combinedAnswers)) {
      toast({
        title: "Preencha todas as respostas antes de enviar.",
        description: undefined,
        status: "warning",
        duration: 'low'
      });
      return;
    }

    try {
      await sendBatchAnswers({ answers: mapAnswersToPayload(combinedAnswers) });

      onQuestionsMutated();
      await updateStudyStatus();

      if (selectionContext) {
        selectionContext.reloadArticles();
      }

      toast({
        title: "Respostas enviadas com sucesso!",
        description: undefined,
        status: "success",
        duration: 'low'
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar respostas",
        description: "Tente novamente mais tarde.",
        status: "error",
        duration: 'low'
      });
    }
  };

  return { submitResponses };
}
