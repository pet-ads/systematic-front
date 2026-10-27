import Axios from "../../../../infrastructure/http/axiosClient";

export async function getReviewMode(systematicStudyId: string) {
  const response = await Axios.get(`systematic-study/${systematicStudyId}/review-mode`);
  return response.data;
}

export async function updateReviewMode(systematicStudyId: string, payload: any) {
  return await Axios.patch(`systematic-study/${systematicStudyId}/review-mode`, payload);
}