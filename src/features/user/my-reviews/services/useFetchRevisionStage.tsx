// External library
import useSWR from "swr";
import { useTranslation } from "react-i18next";

// Service
import Axios from "../../../../infrastructure/http/axiosClient";

// Type
type RevisionStageProps = {
  reviewId: string;
};

export type Stage =
  | "GENERAL_DEFINITION"
  | "RESEARCH_QUESTIONS"
  | "PICOC"
  | "ELIGIBILITY_CRITERIA"
  | "INFORMATION_SOURCES_AND_SEARCH_STRATEGY"
  | "SELECTION_AND_EXTRACTION"
  | "RISK_OF_BIAS"
  | "ANALYSIS_AND_SYNTHESIS_METHOD"
  | "IDENTIFICATION"
  | "SELECTION"
  | "EXTRACTION"
  | "GRAPHICS"
  | "FINALIZATION";

type HttpResponse = {
  currentStage: string;
};

export default function useFetchRevisionStage({
  reviewId,
}: RevisionStageProps) {
  const path = reviewId ? `systematic-study/${reviewId}/protocol/stage` : null;
  
  const { t } = useTranslation("user/my-reviews");

  async function getStage(): Promise<Stage> {
    if (!path) throw new Error("Invalid path");
    try {
      const response = await Axios.get<HttpResponse>(path);
      return response.data.currentStage as Stage;
    } catch (error) {
      console.log("Error at get revision Stage");
      throw new Error("Error at get revision Stage");
    }
  }

  const { data, error, isLoading, mutate } = useSWR(path, getStage, {
    revalidateOnFocus: false,
  });

  const StageMap: Record<Stage, string> = {
    GENERAL_DEFINITION: t("status.GENERAL_DEFINITION"),
    RESEARCH_QUESTIONS: t("status.RESEARCH_QUESTIONS"),
    PICOC: t("status.PICOC"),
    ELIGIBILITY_CRITERIA: t("status.ELIGIBILITY_CRITERIA"),
    INFORMATION_SOURCES_AND_SEARCH_STRATEGY:
      t("status.INFORMATION_SOURCES_AND_SEARCH_STRATEGY"),
    SELECTION_AND_EXTRACTION: t("status.SELECTION_AND_EXTRACTION"),
    RISK_OF_BIAS: t("status.RISK_OF_BIAS"),
    ANALYSIS_AND_SYNTHESIS_METHOD: t("status.ANALYSIS_AND_SYNTHESIS_METHOD"),
    IDENTIFICATION: t("status.IDENTIFICATION"),
    SELECTION: t("status.SELECTION"),
    EXTRACTION: t("status.EXTRACTION"),
    GRAPHICS: t("status.GRAPHICS"),
    FINALIZATION: t("status.FINALIZATION"),
  };

  const currentStage = StageMap[data as Stage];

  return {
    stage: data,
    formatedStage: currentStage,
    error,
    isLoading,
    mutate,
  };
}
