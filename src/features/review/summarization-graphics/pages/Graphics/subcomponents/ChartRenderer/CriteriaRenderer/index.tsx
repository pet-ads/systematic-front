import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";
import CriteriaBarChart from "../../CriteriaBarChart";
import { Box } from "@chakra-ui/react";

type Props = {
  filteredStudies: (StudyInterface | ArticleInterface)[];
  stage: "selection" | "extraction";
  criteria: "inclusion" | "exclusion";
  chartId: string;
};

export default function CriteriaRenderer({ filteredStudies, stage, criteria, chartId}: Props) {
  return (
    <Box 
      id={chartId}
      w="100%"
      minH="auto" 
      display="flex"
      justifyContent="center" 
      alignItems="center" 
      pt={10} 
      pb={10}
    >
      <Box w="100%" maxW="1600px" display="flex" justifyContent="center">
        <Box w="100%">
          <CriteriaBarChart criteria={criteria} stage={stage} filteredStudies={filteredStudies} />
        </Box>
      </Box>
    </Box>
  );
}