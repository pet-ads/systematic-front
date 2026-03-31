import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";
import LayoutFactoryChart from "@features/review/summarization-graphics/components/tables/ChartTable/LayoutFactoryChart";
import { IncludedStudiesLineChart } from "../../IncludedStudiesLineChart";
import BubbleChart from "@features/review/summarization-graphics/components/charts/BubbleChart";
import useBubbleDataGeneric, { BubbleItem } from "@features/review/summarization-graphics/hooks/useBubbleDataGeneric";
import { Box } from "@chakra-ui/react";


type Props = {
  filteredStudies: (StudyInterface | ArticleInterface)[];
  type: string;
  chartId: string;
};

export default function IncludedStudiesRenderer({ filteredStudies, type, chartId}: Props) {
  const includedStudies = filteredStudies.filter((s) => s.extractionStatus === "INCLUDED");



  let content;
  if (type === "Table") content = <LayoutFactoryChart articles={includedStudies as ArticleInterface[]} isLoading={false} />;
  else if (type === "Line Chart") content = <IncludedStudiesLineChart filteredStudies={includedStudies} />;
  else if (type === "Bubble Chart") {
    const items: BubbleItem[] = includedStudies.flatMap(study => 
      study.searchSources.map(src => ({ x: Number(study.year), group: src, y: 1 }))
    );
       const { series, yCategories } = useBubbleDataGeneric(items);
       content = (
   <BubbleChart
     title="Search Sources Evolution"
     series={series}            
     yCategories={yCategories}  
     yaxisText="Número de estudos"
   />
    
       );
  } else content = <div>Tipo de gráfico não suportado</div>;

  return <Box id={chartId}>{content}</Box>;
}
