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
    const basePath = "/newReview/";

    const StageMap: Record<Stage, string> = {
      PROTOCOL_PART_I: `${basePath}protocol/${reviewId}`,
      PICOC: `${basePath}protocol/${reviewId}`,
      PROTOCOL_PART_II: `${basePath}protocolpartTwo/${reviewId}`,
      PROTOCOL_PART_III: `${basePath}protocolpartThree/${reviewId}`,
      IDENTIFICATION: `${basePath}identification`,
      SELECTION: `${basePath}selection`,
      EXTRACTION: `${basePath}extraction`,
      GRAPHICS: `${basePath}graphics`,
      FINALIZATION: `${basePath}finalization`,
    };

    return StageMap[Stage];
  };

  const redirectToPendingStage = () => {
    toGo(getStageLink(stage as Stage));
  };

  return { redirectToPendingStage, stage: formatedStage };
}
