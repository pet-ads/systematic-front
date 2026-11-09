import Axios from "../../../../infrastructure/http/axiosClient";

export type AgreementStage = "selection" | "extraction";
export type JudgeKind = "inclusion" | "exclusion";

interface JudgeStudyProps {
  stage: AgreementStage;
  studyReviewId: number;
  kind: JudgeKind;
  criteria: string[];
  currentCriteria: string[];
}

export async function judgeStudy({
  stage,
  studyReviewId,
  kind,
  criteria,
  currentCriteria,
}: JudgeStudyProps): Promise<void> {
  const id = localStorage.getItem("systematicReviewId");
  if (!id) throw new Error("No systematic review selected.");

  const base = `systematic-study/${id}/agreement/study-review`;

  const staleCriteria = currentCriteria.filter((c) => !criteria.includes(c));
  if (staleCriteria.length > 0) {
    await Axios.patch(`${base}/remove-criteria/${studyReviewId}`, {
      criteria: staleCriteria,
      stage: stage.toUpperCase(),
    });
  }

  await Axios.patch(
    `${base}/${stage === "selection" ? "selection-status" : "extraction-status"}`,
    {
      studyReviewId: [studyReviewId],
      status: kind === "inclusion" ? "INCLUDED" : "EXCLUDED",
      criteria,
    }
  );
}