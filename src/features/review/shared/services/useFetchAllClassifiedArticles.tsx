import { useContext, useMemo } from "react";

import StudyContext from "@features/review/shared/context/StudiesContext";

import ArticleInterface from "../types/ArticleInterface";

type ArticleStatus = "INCLUDED" | "UNCLASSIFIED" | "DUPLICATED" | "EXCLUDED";

type ClassifiedArticlesOutput = {
  includedArticlesList: ArticleInterface[];
  unclassifiedArticlesList: ArticleInterface[];
  duplicatedArticlesList: ArticleInterface[];
  excludedArticlesList: ArticleInterface[];
};

export default function useFetchAllClassifiedArticles(): ClassifiedArticlesOutput {
  const studiesContext = useContext(StudyContext);

  const classifiedArticles = useMemo(() => {
    const articlesStatusMap: Record<ArticleStatus, ArticleInterface[]> = {
      INCLUDED: [],
      UNCLASSIFIED: [],
      DUPLICATED: [],
      EXCLUDED: [],
    };

    const articles = studiesContext?.getArticles('Selection')

    if (!articles) return articlesStatusMap;

    articles.map((article) => {
      if (!("studyReviewId" in article)) return;
      const status = article.selectionStatus as ArticleStatus;
      articlesStatusMap[status].push(article);
    });

    return articlesStatusMap;
  }, [studiesContext]);

  return {
    includedArticlesList: classifiedArticles.INCLUDED,
    unclassifiedArticlesList: classifiedArticles.UNCLASSIFIED,
    duplicatedArticlesList: classifiedArticles.DUPLICATED,
    excludedArticlesList: classifiedArticles.EXCLUDED,
  };
}
