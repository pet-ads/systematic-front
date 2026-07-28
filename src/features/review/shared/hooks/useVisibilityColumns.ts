// External library
import { useMemo, useState, useEffect } from "react";

// Hooks
import useWindowWidth from "@features/shared/hooks/useWindowWidth";

// Types
import { PageLayout } from "../components/structure/LayoutFactory";

export type ColumnVisibility = {
  studyReviewId: boolean | null;
  title: boolean | null;
  authors: boolean | null;
  venue: boolean | null;
  year: boolean | null;
  selectionStatus: boolean | null;
  extractionStatus: boolean | null;
  score: boolean | null;
  readingPriority: boolean | null;
  source: boolean | null;
  included: boolean | null;
  excluded: boolean | null;
  total: boolean | null;
  indexingRate: boolean | null;
  precisionRate: boolean | null;
  sources: boolean | null;
  ic: boolean | null;
  answer: boolean | null;
  studies: boolean | null;
  totalAnswers: boolean | null;
  percentageOfTotal: boolean | null;
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
  source: true,
  included: true,
  excluded: true,
  total: true,
  indexingRate: true,
  precisionRate: true,
  sources: true,
  ic: true,
  answer: true,
  studies: true,
  totalAnswers: true,
  percentageOfTotal: true,
};

export default function useVisibiltyColumns({
  page,
}: UseVisibilityColumnsInput): UseVisibilityColumnsOutput {
  const window = useWindowWidth();

  const initialVisibility = useMemo(() => {
    const visibility = { ...defaultVisibility };
    if (page === "Selection") {
      visibility.extractionStatus = null;
      visibility.source = null;
      visibility.included = null;
      visibility.excluded = null;
      visibility.total = null;
      visibility.indexingRate = null;
      visibility.precisionRate = null;
      visibility.sources = null;
      visibility.ic = null;
      visibility.answer = null;
      visibility.studies = null;
      visibility.totalAnswers = null;
      visibility.percentageOfTotal = null;
      if(window < 1100) {
        visibility.readingPriority = false;
        visibility.score = false;
        visibility.venue = false;
      }
    }
    if (page === "Extraction") {
      visibility.selectionStatus = null;
      visibility.source = null;
      visibility.included = null;
      visibility.excluded = null;
      visibility.total = null;
      visibility.indexingRate = null;
      visibility.precisionRate = null;
      visibility.sources = null;
      visibility.ic = null;
      visibility.answer = null;
      visibility.studies = null;
      visibility.totalAnswers = null;
      visibility.percentageOfTotal = null;
      if(window < 1100) {
        visibility.readingPriority = false;
        visibility.score = false;
        visibility.venue = false;
      }
    }
    if (page === "Identification"){
      visibility.selectionStatus = null;
      visibility.extractionStatus = null;
      visibility.score = false;
      visibility.readingPriority = false;
      visibility.source = null;
      visibility.included = null;
      visibility.excluded = null;
      visibility.total = null;
      visibility.indexingRate = null;
      visibility.precisionRate = null;
      visibility.sources = null;
      visibility.ic = null;
      visibility.answer = null;
      visibility.studies = null;
      visibility.totalAnswers = null;
      visibility.percentageOfTotal = null;
    }
    if (page === "Graphics-SearchSources"){
      visibility.studyReviewId = null;
      visibility.title = null;
      visibility.authors = null;
      visibility.venue = null;
      visibility.year = null;
      visibility.selectionStatus = null;
      visibility.extractionStatus = null;
      visibility.score = null;
      visibility.readingPriority = null;
      visibility.sources = null;
      visibility.ic = null;
      visibility.answer = null;
      visibility.studies = null;
      visibility.totalAnswers = null;
      visibility.percentageOfTotal = null;
    }
    if (page === "Graphics-IncludedStudies") {
      visibility.selectionStatus = null;
      visibility.extractionStatus = null;
      visibility.source = null;
      visibility.included = null;
      visibility.excluded = null;
      visibility.total = null;
      visibility.indexingRate = null;
      visibility.precisionRate = null;
      visibility.score = null;
      visibility.readingPriority = null;
      visibility.answer = null;
      visibility.studies = null;
      visibility.totalAnswers = null;
      visibility.percentageOfTotal = null;
    }
    if (page === "Graphics-FormQuestions") {
      visibility.studyReviewId = null;
      visibility.title = null;
      visibility.authors = null;
      visibility.venue = null;
      visibility.year = null;
      visibility.selectionStatus = null;
      visibility.extractionStatus = null;
      visibility.score = null;
      visibility.readingPriority = null;
      visibility.source = null;
      visibility.included = null;
      visibility.excluded = null;
      visibility.total = null;
      visibility.indexingRate = null;
      visibility.precisionRate = null;
      visibility.sources = null;
      visibility.ic = null;
    }
    if(page === "Graphics-TextualQuestion") {
      visibility.selectionStatus = null;
      visibility.extractionStatus = null;
      visibility.source = null;
      visibility.included = null;
      visibility.excluded = null;
      visibility.total = null;
      visibility.indexingRate = null;
      visibility.precisionRate = null;
      visibility.score = null;
      visibility.readingPriority = null;
      visibility.studies = null;
      visibility.totalAnswers = null;
      visibility.percentageOfTotal = null;   
      visibility.sources = null;
      visibility.ic = null;  
      visibility.venue = null;
      visibility.year = null; 
    }
    return visibility;
  }, [page]);

  const [columnsVisible, setColumnsVisible] =
    useState<ColumnVisibility>(initialVisibility);

  useEffect(() => {
    setColumnsVisible(initialVisibility);
  }, [initialVisibility]);

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
