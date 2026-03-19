import Axios from "../../../../infrastructure/http/axiosClient";

interface Props {
  studyReviewId: number[];
  status: "INCLUDED" | "EXCLUDED" | "UNCLASSIFIED";
  criterias: string[];
}

export const UseChangeStudyExtractionStatus = ({
  studyReviewId,
  status,
  criterias,
}: Props) => {
  const id = localStorage.getItem("systematicReviewId");
  const path = `systematic-study/${id}/study-review/extraction-status`;

  // Adicionamos o "return" aqui também
  return Axios.patch(path, { status, criteria: criterias, studyReviewId });
};
