import { Box } from "@chakra-ui/react";
import { QuestionsCharts } from "../../QuestionsCharts";
import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";
import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";
import { Dispatch, SetStateAction } from "react";
import { PageLayout } from "@features/review/shared/components/structure/LayoutFactory";

type Props = {
  filteredStudies: (StudyInterface | ArticleInterface)[];
  type: string;
  chartId: string;
  selectedQuestionId?: string;
  columnsVisible: ColumnVisibility;
  setTablePage: Dispatch<SetStateAction<PageLayout>>
};

export default function FormQuestionsRenderer({
  filteredStudies,
  type,
  selectedQuestionId,
  chartId,
  columnsVisible,
  setTablePage
}: Props) {
  return (
    <Box 
      id={chartId}
      w="100%"
      display="block" 
      pt={4} 
      pb={10}
    >
      <QuestionsCharts
        filteredStudies={filteredStudies as ArticleInterface[]}
        type={type}
        selectedQuestionId={selectedQuestionId}
        columnsVisible={columnsVisible}
        setTablePage={setTablePage}
      />
    </Box>
  );
}