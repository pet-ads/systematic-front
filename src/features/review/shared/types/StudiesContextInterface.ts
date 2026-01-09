import { KeyedMutator } from "swr";
import ArticleInterface from "./ArticleInterface";
import { StudyInterface } from "./IStudy";
import { SelectionArticles } from "@features/review/execution-selection/services/useFetchSelectionArticles";
import { Dispatch, SetStateAction } from "react";

export interface InvalidEntry {
  id: string;
  fileName: string;
  fileExtension: string;
  entries: string[];
}

export default interface AppContextType {
  isIncluded: boolean;
  setIsIncluded: React.Dispatch<React.SetStateAction<boolean>>;
  isExcluded: boolean;
  setIsExcluded: React.Dispatch<React.SetStateAction<boolean>>;
  articles: ArticleInterface[] | StudyInterface[] | [];
  reloadArticles: KeyedMutator<SelectionArticles>;
  reload: boolean;
  setReload: Dispatch<SetStateAction<boolean>>;
  invalidEntries: InvalidEntry[];
  setInvalidEntries: Dispatch<SetStateAction<InvalidEntry[]>>;
  isLoading: boolean;
  selectedArticles: Record<
    number,
    { id: number; title: string; isChecked: boolean }
  >;
  toggleArticlesSelection: (id: number, tittle: string) => void;
  firstSelected: number | null;
  deletedArticles: number[] | [];
  clearSelectedArticles: () => void;
  selectedArticleReview: number;
  setSelectedArticleReview: Dispatch<SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>
}