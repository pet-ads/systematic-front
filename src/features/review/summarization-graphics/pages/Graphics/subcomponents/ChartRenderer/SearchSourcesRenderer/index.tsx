import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";
import BarChart from "@features/review/summarization-graphics/components/charts/BarChart";
import BubbleChart from "@features/review/summarization-graphics/components/charts/BubbleChart";
import PieChart from "@features/review/summarization-graphics/components/charts/PieChart";
import { SearchSorcesTable } from "@features/review/summarization-graphics/components/tables/SearchSoucesTable";
import { Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import useBubbleDataGeneric, {
  BubbleItem,
} from "@features/review/summarization-graphics/hooks/useBubbleDataGeneric";

import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";

type Props = {
  filteredStudies: (StudyInterface | ArticleInterface)[];
  type: string;
  chartId: string;
  columnsVisible: ColumnVisibility;
};

export default function SearchSourcesRenderer({
  filteredStudies,
  type,
  chartId,
  columnsVisible,
}: Props) {
  const { t } = useTranslation("review/summarization-graphics");

  const sourceCountMap = filteredStudies.reduce<Record<string, number>>(
    (acc, study) => {
      acc[study.searchSources[0]] = (acc[study.searchSources[0]] || 0) + 1;
      /* study.searchSources.forEach((src) => {
        acc[src] = (acc[src] || 0) + 1;
      }); */
      return acc;
    },
    {}
  );

  const labels = Object.keys(sourceCountMap);
  const data = Object.values(sourceCountMap);

  const isTable = type === "Table" || type === "Tabela";
  const isBubble = type === t("selectMenu.graphicsTypes.bubbleChart");
  
  const bubbleItems: BubbleItem[] = filteredStudies.flatMap((study) => ({
    x: Number(study.year),
    group: study.searchSources[0],
    y: 1,
  })
  /*study.searchSources.map((src) => ({
      x: Number(study.year),
      group: src,
      y: 1,
    })) */
  );
  const { series, yCategories } = useBubbleDataGeneric(bubbleItems);

  let content;

  if (type === t("selectMenu.graphicsTypes.pieChart")) {
    content = <PieChart title={t("sectionMenu.sections.searchSources")} labels={labels} data={data} />;
  } else if (type === t("selectMenu.graphicsTypes.barChart")) {
    content = (
      <BarChart
        title={t("sectionMenu.sections.searchSources")}
        labels={labels}
        data={data}
        section="searchSource"
      />
    );
  } else if (isBubble) {
    content = (
      <BubbleChart
        title={t("searchSourcesEvolution")}
        series={series}
        yCategories={yCategories}
        yaxisText={t("sectionMenu.sections.searchSources")}
      />
    );
  } else if (isTable) {
    content = <SearchSorcesTable sourceCountMap={sourceCountMap} columnsVisible={columnsVisible} />;
  } else {
    content = <div>{t("typeNotSupported")}</div>;
  }
  
  return <Box id={chartId} w="100%" h="100%" >{content}</Box>;
}