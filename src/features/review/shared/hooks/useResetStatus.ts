// Hooks
import { UseChangeStudySelectionStatus } from "../services/useChangeStudySelectionStatus";
import { UseChangeStudyExtractionStatus } from "../services/useChangeStudyExtractionStatus";

//Types
import { PageLayout } from "../components/structure/LayoutFactory";
import { SelectionArticles } from "@features/review/execution-selection/services/useFetchSelectionArticles";
import { KeyedMutator } from "swr";

interface ResetButtonProps {
  page: PageLayout;
  reloadArticles: KeyedMutator<SelectionArticles>;
}

const useResetStatus = ({ page, reloadArticles }: ResetButtonProps) => {
  const handleResetStatusToUnclassified = async (
    articleId: number,
    historicalCriteria: string[] = [],
  ) => {
    if (!articleId || articleId === -1) return;

    try {
      if (page === "Selection") {
        await UseChangeStudySelectionStatus({
          studyReviewId: [articleId],
          status: "UNCLASSIFIED",
          criterias: [],
        });
      } else {
        await UseChangeStudyExtractionStatus({
          studyReviewId: [articleId],
          status: "UNCLASSIFIED",
          criterias: historicalCriteria,
        });
      }

      await reloadArticles();
    } catch (error) {
      console.error("Erro ao resetar o artigo:", error);
    }
  };

  return { handleResetStatusToUnclassified };
};

export default useResetStatus;
