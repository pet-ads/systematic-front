// Service
import useFetchRevisionStage from "./useFetchRevisionStage.tsx";

// Hook
import { useNavigation } from "@features/shared/hooks/useNavigation";

// Type
import type { Stage } from "./useFetchRevisionStage.tsx";

type NavigateToPendingStageProps = {
  reviewId: string;
};

export default function useNavigateToPendingStage({
  reviewId,
}: NavigateToPendingStageProps) {
  const { stage, formatedStage } = useFetchRevisionStage({ reviewId });

  const { toGo } = useNavigation();

  const getStageLink = (Stage: Stage) => {
    const StageMap: Record<Stage, string> = {
      GENERAL_DEFINITION: `/review/planning/protocol/general-definition`,
      RESEARCH_QUESTIONS: `/review/planning/protocol/research-questions/${reviewId}`,
      PICOC: `/review/planning/protocol/picoc/${reviewId}`,
      ELIGIBILITY_CRITERIA: `/review/planning/protocol/eligibility-criteria/${reviewId}`,
      INFORMATION_SOURCES_AND_SEARCH_STRATEGY: `/review/planning/protocol/information-sources-and-search-strategy/${reviewId}`,
      SELECTION_AND_EXTRACTION: `/review/planning/protocol/selection-and-extraction/${reviewId}`,
      RISK_OF_BIAS: `/review/planning/protocol/risk-of-bias-assessment/${reviewId}`,
      ANALYSIS_AND_SYNTHESIS_METHOD: `/review/planning/protocol/analysis-and-synthesis-of-results/${reviewId}`,
      IDENTIFICATION: `/review/execution/identification`,
      SELECTION: `/review/execution/selection`,
      EXTRACTION: `/review/execution/extraction`,
      GRAPHICS: `/review/summarization/graphics`,
      FINALIZATION: `/review/summarization/finalization`,
    };

    return StageMap[Stage];
  };

  const redirectToPendingStage = () => {
    toGo(getStageLink(stage as Stage));
  };

  return { redirectToPendingStage, stage: formatedStage };
}
