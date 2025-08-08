// External library
import { useMemo, useState } from "react";

// Types
import { PageLayout } from "../components/structure/LayoutFactory";

export type ColumnVisibility = {
  studyReviewId: boolean;
  title: boolean;
  authors: boolean;
  venue: boolean;
  year: boolean;
  selectionStatus: boolean | null;
  extractionStatus: boolean | null;
  score: boolean;
  readingPriority: boolean;
};

type UseVisibilityColumnsInput = {
  page: PageLayout;
};

type UseVisibilityColumnsOutput = {
  columnsVisible: ColumnVisibility;
  toggleColumnVisibility: (column: keyof ColumnVisibility) => void;
};

// Constants
const defaultVisibility: ColumnVisibility = {
  studyReviewId: true,
  title: true,
  authors: true,
  venue: true,
  year: true,
  selectionStatus: true,
  extractionStatus: true,
  score: true,
  readingPriority: true,
};

export default function useVisibiltyColumns({
  page,
}: UseVisibilityColumnsInput): UseVisibilityColumnsOutput {
  const initialVisibility = useMemo(() => {
    const visibility = { ...defaultVisibility };
    if (page === "Selection") {
      visibility.extractionStatus = null;
    }
    if (page === "Extraction") {
      visibility.selectionStatus = null;
    }
    return visibility;
  }, [page]);

  const [columnsVisible, setColumnsVisible] =
    useState<ColumnVisibility>(initialVisibility);

  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnsVisible((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return {
    columnsVisible,
    toggleColumnVisibility,
  };
}
