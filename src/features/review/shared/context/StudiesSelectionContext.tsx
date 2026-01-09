import React, {
  ReactNode,
  createContext,
  useState,
} from "react";

import useSelectedArticles from "../hooks/useSelectedArticles";
import useFetchSelectionArticles from "@features/review/execution-selection/services/useFetchSelectionArticles";
import AppContextType, { InvalidEntry } from "../types/StudiesContextInterface";



const StudySelectionContext = createContext<AppContextType | undefined>(
  undefined
);

interface AppProviderProps {
  children: ReactNode;
}

export const StudySelectionProvider: React.FC<AppProviderProps> = ({
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
    useFetchSelectionArticles({
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
    <StudySelectionContext.Provider
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
    </StudySelectionContext.Provider>
  );
};

export default StudySelectionContext;
