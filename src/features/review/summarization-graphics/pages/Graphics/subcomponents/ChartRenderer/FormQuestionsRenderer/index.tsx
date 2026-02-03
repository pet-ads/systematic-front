
import { Box } from "@chakra-ui/react";
import { QuestionsCharts } from "../../QuestionsCharts";
import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";

type Props = {
  filteredStudies: (StudyInterface | ArticleInterface)[];
  type: string;
  chartId: string;
  selectedQuestionId?: string;

};

export default function FormQuestionsRenderer({
  filteredStudies,
  type,
  selectedQuestionId,
  chartId,

}: Props) {
  return (
    <Box id={chartId}>
      <QuestionsCharts
        filteredStudies={filteredStudies as ArticleInterface[]}
        type={type}
        selectedQuestionId={selectedQuestionId}
     
      />
    </Box>
  );
}

