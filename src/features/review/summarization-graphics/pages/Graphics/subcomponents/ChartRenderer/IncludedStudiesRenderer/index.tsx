import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";
import LayoutFactoryChart from "@features/review/summarization-graphics/components/tables/ChartTable/LayoutFactoryChart";
import { IncludedStudiesLineChart } from "../../IncludedStudiesLineChart";
import BubbleChart from "@features/review/summarization-graphics/components/charts/BubbleChart";
import useBubbleDataGeneric, { BubbleItem } from "@features/review/summarization-graphics/hooks/useBubbleDataGeneric";
import { Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";


type Props = {
  filteredStudies: (StudyInterface | ArticleInterface)[];
  type: string;
  chartId: string;
  columnsVisible: ColumnVisibility;
};

export default function IncludedStudiesRenderer({ filteredStudies, type, chartId, columnsVisible}: Props) {
  const { t } = useTranslation("review/summarization-graphics");
  const includedStudies = filteredStudies.filter((s) => s.extractionStatus === "INCLUDED");

  const isTable = type === "Table" || type === "Tabela";
  const isBubble = type === "Bubble Chart" || type === "Gráfico de Bolhas";
  
  const bubbleItems: BubbleItem[] = includedStudies.flatMap((study) => ({ 
    x: Number(study.year),
    group: study.searchSources[0],
    y: 1
  }));
  const { series, yCategories } = useBubbleDataGeneric(bubbleItems);

  let content;
  
  if (isTable) {
    content = (
      <LayoutFactoryChart columnsVisible={columnsVisible} articles={includedStudies as ArticleInterface[]} isLoading={false} />
    );
  } else if (type === "Line Chart" || type === "Gráfico de Linhas") {
    content = (
      <IncludedStudiesLineChart filteredStudies={includedStudies} />
    );
  } else if (isBubble) {
    content = (
      <BubbleChart
        title="Search Sources Evolution"
        series={series}            
        yCategories={yCategories}  
        yaxisText="Search Sources"
      />
    );
  } else {
    content = <div>{t("typeNotSupported")}</div>;
  }

  return <Box id={chartId} minH={0} w="100%" h="100%" flex="1" display="flex" flexDirection="column">{content}</Box>;
}