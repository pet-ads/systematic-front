import Axios from "../../../../infrastructure/http/axiosClient";
import { PageLayout } from "../components/structure/LayoutFactory";

interface SendDuplicatedStudiesProps {
  firstSelected: number;
  duplicatedStudies: number[];
  page: PageLayout
}

export default function useSendDuplicatedStudies({
  firstSelected,
  duplicatedStudies,
  page,
}: SendDuplicatedStudiesProps) {
  const studyReviewId = localStorage.getItem("systematicReviewId");

  const sendDuplicatedStudies = async () => {
    if (firstSelected === null) return;
    const path = `systematic-study/${studyReviewId}/study-review/${firstSelected}/duplicated`;
    await Axios.patch(path, {
      duplicatedStudyIds: duplicatedStudies,
      stage: page.toUpperCase(),
    });
  };

  return {
    sendDuplicatedStudies,
  };
}
