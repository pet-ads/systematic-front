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
    // 1. Transformamos em async
    async (
      status: "INCLUDED" | "EXCLUDED" | "UNCLASSIFIED",
      criterias: string[],
    ) => {
      const updateFunction =
        page === "Selection"
          ? UseChangeStudySelectionStatus
          : UseChangeStudyExtractionStatus;

      try {
        // 2. Esperamos (await) o backend salvar os dados
        await updateFunction({
          studyReviewId: [selectedArticleReview],
          criterias,
          status,
        });

        // 3. Só DEPOIS pedimos pro SWR atualizar a lista
        await reloadArticles();
      } catch (error) {
        console.error("Erro ao atualizar o status:", error);
      }
    },
    [page, selectedArticleReview, reloadArticles],
  );

  const handleIncludeItemClick = useCallback(
    (criterias: string[]) => {
      const newStatus = criterias.length === 0 ? "UNCLASSIFIED" : "INCLUDED";
      console.log(
        "Enviando pro backend -> Status:",
        newStatus,
        "Critérios:",
        criterias,
      ); // <-- ADICIONE ISSO
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
