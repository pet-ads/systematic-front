// Hooks
import { UseChangeStudySelectionStatus } from "../services/useChangeStudySelectionStatus";
import { UseChangeStudyExtractionStatus } from "../services/useChangeStudyExtractionStatus";
import Axios from "../../../../infrastructure/http/axiosClient"; // Adicionado a importação do Axios

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
        await UseChangeStudyExtractionStatus({
          studyReviewId: [articleId],
          status: "UNCLASSIFIED",
          criterias: [],
        });

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
      
      if (historicalCriteria && historicalCriteria.length > 0) {
        const id = localStorage.getItem("systematicReviewId");
        if (id) {
          const path = `systematic-study/${id}/study-review/remove-criteria/${articleId}`;
          await Axios.patch(path, { criteria: historicalCriteria }).catch(
            (err) => console.warn("Aviso: Falha ao limpar critérios fisicamente no reset", err)
          );
        }
      }

      await reloadArticles();
    } catch (error) {
      console.error("Erro ao resetar o artigo:", error);
    }
  };

  return { handleResetStatusToUnclassified };
};

export default useResetStatus;