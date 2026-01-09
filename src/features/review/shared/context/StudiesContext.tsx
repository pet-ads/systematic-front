import React, {
  ReactNode,
  createContext,
  useCallback,
  useState,
} from "react";

import useSelectedArticles from "../hooks/useSelectedArticles";
import useFetchSelectionArticles from "@features/review/execution-selection/services/useFetchSelectionArticles";
import useFetchExtractionArticles from "@features/review/execution-extraction/services/useFetchExtractionArticles";
import AppContextType, { InvalidEntry } from "../types/StudiesContextInterface";
import { PageLayout } from "../components/structure/LayoutFactory";

const StudyContext = createContext<AppContextType | undefined>(
  undefined
);

interface AppProviderProps {
  children: ReactNode;
}

export const StudyProvider: React.FC<AppProviderProps> = ({
  children,
}) => {
  const [isIncluded, setIsIncluded] = useState(false);
  const [reload, setReload] = useState(false);
  const [isExcluded, setIsExcluded] = useState(false);
  const [invalidEntries, setInvalidEntries] = useState<InvalidEntry[]>([]);
  const [selectedArticleReview, setSelectedArticleReview] = useState(-1);
  const [page, setPage] = useState<number>(1)
  const [size, setSize] = useState(20)

  const selectionFetch = useFetchSelectionArticles({
    page: page - 1,
    size: size,
  });

  const extractionFetch = useFetchExtractionArticles({
    page: page - 1,
    size: size,
  });

  const getArticles = useCallback(
    (page: PageLayout) => {
      if (page === "Selection" || page === "Identification") {
        return selectionFetch.articles;
      }
      return extractionFetch.articles;
    },
    [selectionFetch.articles, extractionFetch.articles]
  );

  const isLoading = useCallback(
    (page: PageLayout) => {
      if (page === "Selection" || page === "Identification") {
        return selectionFetch.isLoading;
      }
      return extractionFetch.isLoading;
    },
    [selectionFetch.isLoading, extractionFetch.isLoading]
  );

  const reloadArticles = useCallback(
    (page: PageLayout) => {
      if (page === "Selection" || page === "Identification") {
        selectionFetch.mutate();
      } else {
        extractionFetch.mutate();
      }
    },
    [selectionFetch, extractionFetch]
  );

  const {
    selectedArticles,
    toggleArticlesSelection,
    firstSelected,
    deletedArticles,
    clearSelectedArticles,
  } = useSelectedArticles();

  return (
    <StudyContext.Provider
      value={{
        isIncluded,
        setIsIncluded,
        isExcluded,
        setIsExcluded,
        reloadArticles,
        reload,
        setReload,
        invalidEntries,
        setInvalidEntries,
        isLoading,
        selectedArticles,
        toggleArticlesSelection,
        firstSelected,
        deletedArticles,
        clearSelectedArticles,
        selectedArticleReview,
        setSelectedArticleReview,
        page,
        setPage,
        size,
        setSize,
        getArticles
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export default StudyContext;
