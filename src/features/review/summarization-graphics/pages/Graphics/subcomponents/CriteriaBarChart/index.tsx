import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";

import { Text } from "@chakra-ui/react";

import BarChart from "../../../../components/charts/BarChart";
import { useFetchStudiesByStage } from "../../../../services/useFetchStudiesByStage";
import useFetchStudiesByCriteria from "../../../../services/useFetchStudiesByCriteria";

type Props = {
  criteria: "inclusion" | "exclusion";
  stage: "selection" | "extraction";
  filteredStudies: (ArticleInterface | StudyInterface)[];
};

export default function CriteriaBarChart({
  criteria,
  stage,
  filteredStudies,
}: Props) {
  const color = criteria === "inclusion" ? "#3c73b6" : "#C21807";
  const { studiesByStage, isLoadingByStage } = useFetchStudiesByStage(stage);
  const { studiesByCriteria, isLoadingByCriteria } =
    useFetchStudiesByCriteria(criteria);

  if (isLoadingByCriteria || isLoadingByStage)
    return <Text>Loading chart...</Text>;

  const stageStudyIds =
    criteria === "inclusion"
      ? studiesByStage?.includedStudies.ids ?? []
      : studiesByStage?.excludedStudies.ids ?? [];
  console.log(stageStudyIds);

  const filteredStudiesIds = filteredStudies
    .map((study) => {
      if ("studyReviewId" in study) {
        return study.studyReviewId; //ArticleInterface
      }
      if ("studyId" in study) {
        return study.studyId; //StudyInterface
      }
      return null;
    })
    .filter((id): id is number => id !== null);

  const filteredStageIds = stageStudyIds.filter((id) =>
    filteredStudiesIds.includes(id)
  );

  const criterias = studiesByCriteria?.criteria ?? {};
  const labels = Object.keys(criterias);
  const data = labels.map(
    (label) =>
      criterias[label].filter((id) => filteredStageIds.includes(id)).length
  );

  return (
    <BarChart
      title={
        criteria === "inclusion" ? "Inclusion Criteria" : "Exclusion Criteria"
      }
      labels={labels}
      data={data}
      color={color}
      section={criteria}
    />
  );
}
