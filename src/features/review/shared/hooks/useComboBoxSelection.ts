// External library
import { useCallback, useContext, useRef } from "react";

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

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  if (!studiesContext) throw new Error("Context not available");

  const { selectedArticleReview } = studiesContext;

  const changeStatus = useCallback(
    (status: "INCLUDED" | "EXCLUDED" | "UNCLASSIFIED", criterias: string[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        const updateFunction =
          page === "Selection"
            ? UseChangeStudySelectionStatus
            : UseChangeStudyExtractionStatus;

        try {
          await updateFunction({
            studyReviewId: [selectedArticleReview],
            criterias,
            status,
          });

          await reloadArticles();
        } catch (error) {
          console.error("Erro ao atualizar o status:", error);
        }
      }, 400);
    },
    [page, selectedArticleReview, reloadArticles],
  );

  const handleIncludeItemClick = useCallback(
    (criterias: string[]) => {
      const newStatus = criterias.length === 0 ? "UNCLASSIFIED" : "INCLUDED";
      changeStatus(newStatus, criterias);
    },
    [changeStatus],
  );

  const handleExcludeItemClick = useCallback(
    (criterias: string[]) => {
      const newStatus = criterias.length === 0 ? "UNCLASSIFIED" : "EXCLUDED";
      changeStatus(newStatus, criterias);
    },
    [changeStatus],
  );

  return { handleIncludeItemClick, handleExcludeItemClick };
};

export default useComboBoxSelection;
