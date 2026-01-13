// External library
import { useCallback, useContext } from "react";

// Context
import StudyContext from "@features/review/shared/context/StudiesContext";

// Hook
import { UseChangeStudySelectionStatus } from "../services/useChangeStudySelectionStatus";
import { UseChangeStudyExtractionStatus } from "../services/useChangeStudyExtractionStatus";

// Type
import type { PageLayout } from "../components/structure/LayoutFactory";
import { SelectionArticles } from "@features/review/execution-selection/services/useFetchSelectionArticles";
import { KeyedMutator } from "swr";
interface ComboBoxSelectionProps {
  page: PageLayout;
  reloadArticles: KeyedMutator<SelectionArticles>;
}

const useComboBoxSelection = ({
  page,
  reloadArticles,
}: ComboBoxSelectionProps) => {
  const studiesContext = useContext(StudyContext);

  if (!studiesContext) throw new Error("Context not available");

  const { selectedArticleReview } = studiesContext;

  const changeStatus = useCallback(
    (status: "INCLUDED" | "EXCLUDED", criterias: string[]) => {
      const getFunction =
        page === "Selection"
          ? UseChangeStudySelectionStatus
          : UseChangeStudyExtractionStatus;

      getFunction({
        studyReviewId: [selectedArticleReview],
        criterias,
        status,
      });
      reloadArticles();
    },
    [page, selectedArticleReview, reloadArticles]
  );

  const handleIncludeItemClick = useCallback(
    (criterias: string[]) => {
      changeStatus("INCLUDED", criterias);
    },
    [changeStatus]
  );

  const handleExcludeItemClick = useCallback(
    (criterias: string[]) => {
      changeStatus("EXCLUDED", criterias);
    },
    [changeStatus]
  );

  return { handleIncludeItemClick, handleExcludeItemClick };
};

export default useComboBoxSelection;
