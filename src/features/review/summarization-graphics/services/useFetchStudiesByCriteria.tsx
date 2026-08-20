import useSWR from "swr";
import Axios from "../../../../infrastructure/http/axiosClient";

export type StudiesByCriteriaData = {
  userId: string;
  systematicStudyId: string;
  type: string;
  criteria: {
    [description: string]: number[];
  };
};

const useFetchStudiesByCriteria = (criteria: string, stage: string) => {
  const id = localStorage.getItem("systematicReviewId");
  const path = `systematic-study/${id}/report/criteria/${criteria}`;

  const { data, isLoading, mutate } = useSWR(
    ["studiesByCriteria", criteria],
    () => fetchGetStudiesByCriteria(),
    {
      revalidateOnFocus: false,
    }
  );

  async function fetchGetStudiesByCriteria() {
    if (!id) return;
    try {
      const response = await Axios.get<StudiesByCriteriaData>(path, { params: { stage } });
      return response.data;
    } catch (error) {
      console.error("Failed to get studies by criteria");
    }
  }
  return {
    studiesByCriteria: data,
    isLoadingByCriteria: isLoading,
    mutate,
  };
};

export default useFetchStudiesByCriteria;
