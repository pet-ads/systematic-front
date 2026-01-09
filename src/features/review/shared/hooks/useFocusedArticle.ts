// External library
import { useContext, useMemo } from "react";

// Context
import StudyContext from "@features/review/shared/context/StudiesContext";

// Type
import type ArticleInterface from "../types/ArticleInterface";
import type { PageLayout } from "../components/structure/LayoutFactory";

type FocusedArticleOutputProps = {
  articleInFocus?: ArticleInterface;
};

type FocusedArticleInputProps = {
  page: PageLayout;
};

export default function useFocusedArticle({
  page,
}: FocusedArticleInputProps): FocusedArticleOutputProps {
  const context = useContext(StudyContext)

  if (!context) throw new Error("Context not available");
  const { selectedArticleReview, getArticles } = context;
  const articles = getArticles(page);

  const availableArticlesList = useMemo(() => {
    if (!articles) return [];

    return articles;

  }, [articles]);

  const articleInFocus = useMemo(() => {
    if (selectedArticleReview === undefined || !availableArticlesList.length)
      return undefined;

    return availableArticlesList.find(
      (art): art is ArticleInterface =>
        "studyReviewId" in art && art.studyReviewId === selectedArticleReview
    );
  }, [availableArticlesList, selectedArticleReview]);

  if (!articleInFocus) {
    console.warn("Focus article not found or invalid.", {
      selectedArticleReview,
      availableArticlesLength: availableArticlesList.length,
    });
    return {};
  }

  return { articleInFocus: articleInFocus };
}
