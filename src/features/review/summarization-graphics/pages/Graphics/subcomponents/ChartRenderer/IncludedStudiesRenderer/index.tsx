import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";
import LayoutFactoryChart from "@features/review/summarization-graphics/components/tables/ChartTable/LayoutFactoryChart";
import { IncludedStudiesLineChart } from "../../IncludedStudiesLineChart";
import BubbleChart from "@features/review/summarization-graphics/components/charts/BubbleChart";
import useBubbleDataGeneric, { BubbleItem } from "@features/review/summarization-graphics/hooks/useBubbleDataGeneric";
import { Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";


type Props = {
  filteredStudies: (StudyInterface | ArticleInterface)[];
  type: string;
  chartId: string;
};

export default function IncludedStudiesRenderer({ filteredStudies, type, chartId}: Props) {
  const { t } = useTranslation("review/summarization-graphics");
  const includedStudies = filteredStudies.filter((s) => s.extractionStatus === "INCLUDED");



  let content;
  if (type === "Table" || type === "Tabela") content = <LayoutFactoryChart articles={includedStudies as ArticleInterface[]} isLoading={false} />;
  else if (type === "Line Chart" || type === "Gráfico de Linhas") content = <IncludedStudiesLineChart filteredStudies={includedStudies} />;
  else if (type === "Bubble Chart" || type === "Gráfico de Bolhas") {
    const items: BubbleItem[] = includedStudies.flatMap(study => 
      study.searchSources.map(src => ({ x: Number(study.year), group: src, y: 1 }))
    );
       const { series, yCategories } = useBubbleDataGeneric(items);
       content = (
   <BubbleChart
     title="Search Sources Evolution"
     series={series}            
     yCategories={yCategories}  
     yaxisText="Search Sources"
   />
    
       );
  } else content = <div>{t("typeNotSupported")}</div>;

  return <Box id={chartId}>{content}</Box>;
}
