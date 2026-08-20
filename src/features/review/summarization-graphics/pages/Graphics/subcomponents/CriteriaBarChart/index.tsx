import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";

import { Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import BarChart from "../../../../components/charts/BarChart";
import { useFetchStudiesByStage } from "../../../../services/useFetchStudiesByStage";
import useFetchStudiesByCriteria from "../../../../services/useFetchStudiesByCriteria";

type Props = {
  criteria: "inclusion" | "exclusion";
  stage: "selection" | "extraction";
  filteredStudies: (ArticleInterface | StudyInterface)[];
};

function matchesStageStatus(
  study: ArticleInterface | StudyInterface,
  stage: "selection" | "extraction",
  criteria: "inclusion" | "exclusion"
) {
  const selectionStatus = "selectionStatus" in study ? study.selectionStatus : undefined;
  const extractionStatus = "extractionStatus" in study ? study.extractionStatus : undefined;

  if (stage === "selection") {
    return criteria === "inclusion"
      ? selectionStatus === "INCLUDED"
      : selectionStatus === "EXCLUDED";
  }

  // stage === "extraction": só chegou aqui se passou pela seleção
  if (selectionStatus !== "INCLUDED") return false;

  return criteria === "inclusion"
    ? extractionStatus === "INCLUDED"
    : extractionStatus === "EXCLUDED";
}

export default function CriteriaBarChart({
  criteria,
  stage,
  filteredStudies,
}: Props) {
  const { t } = useTranslation("review/summarization-graphics");
  const color = criteria === "inclusion" ? "#3c73b6" : "#C21807";
  const { studiesByStage, isLoadingByStage } = useFetchStudiesByStage(stage);
  const { studiesByCriteria, isLoadingByCriteria } =
    useFetchStudiesByCriteria(criteria, stage.toUpperCase());

  if (isLoadingByCriteria || isLoadingByStage)
    return <Text>Loading chart...</Text>;

  const stageStudyIds =
    criteria === "inclusion"
      ? studiesByStage?.includedStudies.ids ?? []
      : studiesByStage?.excludedStudies.ids ?? [];
  console.log(stageStudyIds);

  const filteredStudiesIds = filteredStudies
    .filter((study) => matchesStageStatus(study, stage, criteria))
    .map((study) => {
      if ("studyReviewId" in study) {
        return study.studyReviewId; 
      }
      if ("studyId" in study) {
        return study.studyId; 
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
        criteria === "inclusion" ? t("sectionMenu.sections.s1InclusionCriteria") : t("sectionMenu.sections.s1ExclusionCriteria")
      }
      labels={labels}
      data={data}
      color={color}
      section={criteria}
      height={500}
    />
  );
}