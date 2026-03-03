// Hooks
import { UseChangeStudySelectionStatus } from "../services/useChangeStudySelectionStatus";
import { UseChangeStudyExtractionStatus } from "../services/useChangeStudyExtractionStatus";

//Types
import { PageLayout } from "../components/structure/LayoutFactory";
import useFocusedArticle from "./useFocusedArticle";
import { SelectionArticles } from "@features/review/execution-selection/services/useFetchSelectionArticles";
import { KeyedMutator } from "swr";

interface ResetButtonProps {
  page: PageLayout;
  reloadArticles: KeyedMutator<SelectionArticles>;
}

const useResetStatus = ({ page, reloadArticles }: ResetButtonProps) => {
  const { articleInFocus } = useFocusedArticle({ page });

  const handleResetStatusToUnclassified = async () => {
    const articleId = articleInFocus ? articleInFocus?.studyReviewId : -1;

    if (articleId === -1) return;

    try {
      if (page === "Selection") {
        await UseChangeStudySelectionStatus({
          studyReviewId: [articleId],
          status: "UNCLASSIFIED",
          criterias: [],
        });
      } else {
        // EXTRAÇÃO:
        // Voltamos a enviar os critérios existentes para proteger a Seleção.
        // O reset visual será garantido pelo "resetLocalCriterias" no frontend.
        await UseChangeStudyExtractionStatus({
          studyReviewId: [articleId],
          status: "UNCLASSIFIED",
          criterias: articleInFocus?.criteria || [],
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