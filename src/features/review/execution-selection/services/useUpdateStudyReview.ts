import Axios from "../../../../infrastructure/http/axiosClient";

interface Payload {
  searchSessionId: string;
  type: string;
  title: string;
  year: number;
  authors: string;
  venue: string;
  abstract: string;
  keywords: string[];
  source: string;
}

export async function updateStudyReview(
  systematicStudyId: string,
  studyReviewId: number,
  payload: Payload
): Promise<void> {
  const path = `systematic-study/${systematicStudyId}/study-review/${studyReviewId}`;
  await Axios.put(path, payload);
}