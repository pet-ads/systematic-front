import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";
import CriteriaBarChart from "../../CriteriaBarChart";
import { Box } from "@chakra-ui/react";
import { barchartBox } from "../../../styles";

type Props = {
  filteredStudies: (StudyInterface | ArticleInterface)[];
  stage: "selection" | "extraction";
  criteria: "inclusion" | "exclusion";
  chartId: string;

};

export default function CriteriaRenderer({ filteredStudies, stage, criteria, chartId}: Props) {

  return <Box sx={barchartBox} id={chartId}>
    <CriteriaBarChart criteria={criteria} stage={stage} filteredStudies={filteredStudies} />
  </Box>;
}
