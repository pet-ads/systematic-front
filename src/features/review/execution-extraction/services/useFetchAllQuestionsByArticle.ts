// External library
import { useContext, useEffect, useState } from "react";

// Context
import StudyContext from "@features/review/shared/context/StudiesContext";

// Hooks
import useFetchIncludedStudiesAnswers from "./useFetchIncludedStudiesAnswers";

// Types
import type {
  AnswerProps,
  AnswerStrucuture,
  ArticleAnswerStrucuture,
  FormType,
} from "../types";
import type { QuestionAnswer } from "./useFetchIncludedStudiesAnswers";

export default function useFetchAllQuestionsByArticle() {
  const [articlesStructureAnswers, setArticlesStructureAnswers] = useState<
    Record<number, ArticleAnswerStrucuture>
  >({});

  const studiesContext = useContext(StudyContext);

  const articleId = studiesContext ? studiesContext.selectedArticleReview : -1;

  const { question, mutate, isLoading } = useFetchIncludedStudiesAnswers({
    articleId,
  });

  const handlerUpdateAnswerStructure = (
    articleId: number = Number(studiesContext?.selectedArticleReview) || -1,
    questionId: string,
    type: FormType,
    response: AnswerProps,
  ) => {
    const key = type === "EXTRACTION" ? "extractionQuestions" : "robQuestions";

    const article = articlesStructureAnswers[articleId];
    if (!article) return;

    const updatedQuestions = article[key].map((quest) =>
      quest.questionId === questionId ? { ...quest, answer: response } : quest,
    );

    const updatedArticle: ArticleAnswerStrucuture = {
      ...article,
      [key]: updatedQuestions,
    };

    setArticlesStructureAnswers((prev) => ({
      ...prev,
      [articleId]: updatedArticle,
    }));
  };

  function formatLabel(label: string): string {
    const regex = /^Label\(name:\s(.+?),\svalue:\s(\d+)\)$/;
    const match = label.match(regex);
    if (!match) {
      throw new Error("String não está no formato esperado");
    }
    const [, name, value] = match;
    return `${name}: ${value}`;
  }

  function formatAnswer(answer: string | string[] | null): string[] {
    if (!answer) return [];

    if (Array.isArray(answer)) return answer;

    return answer
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  useEffect(() => {
    if (!question) return;

    setArticlesStructureAnswers((prev) => {
      if (prev[articleId]) return prev;

      const mapToStructure = (
        questions: QuestionAnswer[],
      ): AnswerStrucuture[] =>
        questions.map((quest) => {
          let formattedAnswer = quest.answer;

          if (quest.type === "LABELED_SCALE" && quest.answer) {
            formattedAnswer = formatLabel(quest.answer as string);
          }

          if (
            quest.type === "PICK_MANY" &&
            quest.answer &&
            typeof quest.answer != "number"
          ) {
            formattedAnswer = formatAnswer(quest.answer);
          }

          return {
            questionId: quest.questionId,
            description: quest.description,
            code: quest.code,
            type: quest.type,
            answer: {
              value: formattedAnswer,
            },
          };
        });

      const structuredAnswers: ArticleAnswerStrucuture = {
        extractionQuestions: mapToStructure(question.extractionQuestions),
        robQuestions: mapToStructure(question.robQuestions),
      };

      return {
        ...prev,
        [articleId]: structuredAnswers,
      };
    });
  }, [question, articleId]);

  return {
    question: articlesStructureAnswers,
    currentArticleId: articleId,
    handlerUpdateAnswerStructure,
    mutateQuestion: mutate,
    isLoading,
  };
}