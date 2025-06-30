// External library
import useSWR from "swr";

// Service
import Axios from "../../interceptor/interceptor";

// Utils
import getRequestOptions from "../../utils/getRequestOptions";

// Type
type RevisionStageProps = {
  reviewId: string;
};

export type Stage =
  | "PROTOCOL_PART_I"
  | "PICOC"
  | "PROTOCOL_PART_II"
  | "PROTOCOL_PART_III"
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
    PROTOCOL_PART_I: "Protocol Part I",
    PICOC: "PICOC",
    PROTOCOL_PART_II: "Protocol Part II",
    PROTOCOL_PART_III: "Protocol Part III",
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
