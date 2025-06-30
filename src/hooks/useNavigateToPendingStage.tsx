// External library
import { useNavigate } from "react-router-dom";

// Hook
import useFetchRevisionStage from "./fetch/useFetchRevisionStage.tsx";

// Type
import type { Stage } from "./fetch/useFetchRevisionStage.tsx";

type NavigateToPendingStageProps = {
  reviewId: string;
};

export default function useNavigateToPendingStage({
  reviewId,
}: NavigateToPendingStageProps) {
  const { stage, formatedStage } = useFetchRevisionStage({ reviewId });

  const navigate = useNavigate();

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
    navigate(getStageLink(stage as Stage));
  };

  return { redirectToPendingStage, stage: formatedStage };
}
