import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";

import BarChart from "@features/review/summarization-graphics/components/charts/BarChart";
import BubbleChart from "@features/review/summarization-graphics/components/charts/BubbleChart";
import PieChart from "@features/review/summarization-graphics/components/charts/PieChart";
import { SearchSorcesTable } from "@features/review/summarization-graphics/components/tables/SearchSoucesTable";

import { Box } from "@chakra-ui/react";

import useBubbleDataGeneric, {
  BubbleItem,
} from "@features/review/summarization-graphics/hooks/useBubbleDataGeneric";

import { barchartBox } from "../../../styles";

type Props = {
  filteredStudies: (StudyInterface | ArticleInterface)[];
  type: string;
  chartId: string;
};

export default function SearchSourcesRenderer({
  filteredStudies,
  type,
  chartId,
}: Props) {
  const sourceCountMap = filteredStudies.reduce<Record<string, number>>(
    (acc, study) => {
      study.searchSources.forEach((src) => {
        acc[src] = (acc[src] || 0) + 1;
      });
      return acc;
    },
    {}
  );

  const labels = Object.keys(sourceCountMap);
  const data = Object.values(sourceCountMap);

  let content;

  if (type === "Pie Chart") {
    content = <PieChart title="Search Sources" labels={labels} data={data} />;
  } else if (type === "Bar Chart") {
    content = (
      <BarChart
        title="Search Sources"
        labels={labels}
        data={data}
        section="searchSource"
      />
    );
  } else if (type === "Bubble Chart") {
    const items: BubbleItem[] = filteredStudies.flatMap((study) =>
      study.searchSources.map((src) => ({
        x: Number(study.year),
        group: src,
        y: 1,
      }))
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
  } else if (type === "Table") {
    content = <SearchSorcesTable />;
  } else {
    content = <div>Tipo de gráfico não suportado</div>;
  }
  return (

    <Box
      id={chartId}
      w={type === "Bubble Chart" ? "100%" : undefined}
      sx={type === "Bar Chart" ? barchartBox : undefined}
    >
      {content}
    </Box>
  );
}
