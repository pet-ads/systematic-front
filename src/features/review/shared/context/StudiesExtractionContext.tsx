import React, {
  ReactNode,
  createContext,
  useState,
} from "react";

import useSelectedArticles from "../hooks/useSelectedArticles";
import useFetchExtractionArticles from "@features/review/execution-extraction/services/useFetchExtractionArticles";
import AppContextType, { InvalidEntry } from "../types/StudiesContextInterface";

const StudyExtractionContext = createContext<AppContextType | undefined>(
  undefined
);

interface AppProviderProps {
  children: ReactNode;
}

export const StudyExtractionProvider: React.FC<AppProviderProps> = ({
  children,
}) => {
  const [isIncluded, setIsIncluded] = useState(false);
  const [reload, setReload] = useState(false);
  const [isExcluded, setIsExcluded] = useState(false);
  const [invalidEntries, setInvalidEntries] = useState<InvalidEntry[]>([]);
  const [selectedArticleReview, setSelectedArticleReview] = useState(-1);
  const [page, setPage] = useState<number>(1)
  const [size, setSize] = useState(20)
  const { articles, isLoading, mutate } =
    useFetchExtractionArticles({
      page: page - 1,
      size: size,
    });

  const {
    selectedArticles,
    toggleArticlesSelection,
    firstSelected,
    deletedArticles,
    clearSelectedArticles,
  } = useSelectedArticles();

  return (
    <StudyExtractionContext.Provider
      value={{
        isIncluded,
        setIsIncluded,
        isExcluded,
        setIsExcluded,
        articles,
        reloadArticles: mutate,
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
        setSize
      }}
    >
      {children}
    </StudyExtractionContext.Provider>
  );
};

export default StudyExtractionContext;
