// External library
import useSWR from "swr";

// Service
import Axios from "../../../../infrastructure/http/axiosClient";

// Utils
import getRequestOptions from "@features/auth/utils/getRequestOptions";

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
  const path = reviewId
    ? `http://localhost:8080/systematic-study/${reviewId}/protocol/stage`
    : null;

  async function getStage(): Promise<Stage> {
    if (!path) throw new Error("Invalid path");
    try {
      const options = getRequestOptions();
      const response = await Axios.get<HttpResponse>(path, options);
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
    GENERAL_DEFINITION: "General Definition",
    RESEARCH_QUESTIONS: "Research Questions",
    PICOC: "PICOC",
    ELIGIBILITY_CRITERIA: "Eligibility Criteria",
    INFORMATION_SOURCES_AND_SEARCH_STRATEGY:
      "Information Sources And Search Strategy",
    SELECTION_AND_EXTRACTION: "Selection And Extraction",
    RISK_OF_BIAS: "Risk Of Bias",
    ANALYSIS_AND_SYNTHESIS_METHOD: "Analysis And Synthesis Method",
    IDENTIFICATION: "Identification",
    SELECTION: "Selection",
    EXTRACTION: "Extraction",
    GRAPHICS: "Graphics",
    FINALIZATION: "Finalization",
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
