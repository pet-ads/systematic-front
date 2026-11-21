import type { PageLayout } from "../components/structure/LayoutFactory";
import { UseChangeStudySelectionStatus } from "./useChangeStudySelectionStatus";
import { UseChangeStudyExtractionStatus } from "./useChangeStudyExtractionStatus";

type ChangeStatusParams = Parameters<typeof UseChangeStudySelectionStatus>[0];

export const changeStudyStatusByStage = (
  page: PageLayout,
  params: ChangeStatusParams,
) =>
  page === "Selection"
    ? UseChangeStudySelectionStatus(params)
    : UseChangeStudyExtractionStatus(params);