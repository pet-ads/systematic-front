import ArticleInterface from "./ArticleInterface";
import { Dispatch, SetStateAction } from "react";
import { PageLayout } from "../components/structure/LayoutFactory";

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
  reload: boolean;
  setReload: Dispatch<SetStateAction<boolean>>;
  invalidEntries: InvalidEntry[];
  setInvalidEntries: Dispatch<SetStateAction<InvalidEntry[]>>;
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
  setSize: React.Dispatch<React.SetStateAction<number>>;
  getArticles: (page: PageLayout) => ArticleInterface[] | undefined;  
  isLoading: (page: PageLayout) => boolean;
  reloadArticles: (page: PageLayout) => void;
}