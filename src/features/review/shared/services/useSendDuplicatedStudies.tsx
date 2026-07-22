import Axios from "../../../../infrastructure/http/axiosClient";

interface SendDuplicatedStudiesProps {
  firstSelected: number;
  duplicatedStudies: number[];
}

export default function useSendDuplicatedStudies({
  firstSelected,
  duplicatedStudies,
}: SendDuplicatedStudiesProps) {
  const studyReviewId = localStorage.getItem("systematicReviewId");

  const sendDuplicatedStudies = async () => {
    if (firstSelected === null) return;
    const path = `systematic-study/${studyReviewId}/study-review/${firstSelected}/duplicated`;
    await Axios.patch(path, {
      duplicatedStudyIds: duplicatedStudies,
    });
  };

  return {
    sendDuplicatedStudies,
  };
}
