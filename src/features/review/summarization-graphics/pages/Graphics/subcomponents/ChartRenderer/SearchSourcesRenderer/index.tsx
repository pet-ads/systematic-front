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
  const { t } = useTranslation("review/summarization-graphics");
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
  } else if (type === t("selectMenu.graphicsTypes.bubbleChart")) {
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
        title={t("searchSourcesEvolution")}
        series={series}
        yCategories={yCategories}
        yaxisText={t("sectionMenu.sections.searchSources")}
      />
    );
  } else if (type === "Table" || type === "Tabela") {
    content = <SearchSorcesTable />;
  } else {
    content = <div>{t("typeNotSupported")}</div>;
  }
  return (

    <Box
      id={chartId}
      w={type === t("selectMenu.graphicsTypes.bubbleChart") ? "100%" : undefined}
      sx={type === t("selectMenu.graphicsTypes.barChart") ? barchartBox : undefined}
    >
      {content}
    </Box>
  );
}
