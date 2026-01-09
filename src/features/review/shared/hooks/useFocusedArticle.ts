// External library
import { useContext, useMemo } from "react";

// Context
import StudySelectionContext from "@features/review/shared/context/StudiesSelectionContext";
import StudyExtractionContext, { AppContextType } from "@features/review/shared/context/StudiesExtractionContext";

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
  let param: React.Context<AppContextType | undefined>;
  
  if (page === "Selection" || page === "Identification"){
    param = StudySelectionContext
  }else{
    param = StudyExtractionContext
  }
  
  const context = useContext(param)

  if (!context) throw new Error("Context not available");
  const { selectedArticleReview, articles } = context;

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
