import { Box, Text } from "@chakra-ui/react";
import {
  barchartBox,
  fluxogramaBox,
  graphicsconteiner,
  piechartBox,
} from "../../styles";
import CriteriaBarChart from "../CriteriaBarChart";
import { SearchSorcesTable } from "@features/review/summarization-graphics/components/tables/SearchSoucesTable";
import { IncludedStudiesLineChart } from "../IncludedStudiesLineChart";
import { QuestionsCharts } from "../QuestionsCharts";
import StudiesFunnelChart from "../StudiesFunnelChart";
import PieChart from "@features/review/summarization-graphics/components/charts/PieChart";
import BarChart from "@features/review/summarization-graphics/components/charts/BarChart";
import useGetAllReviewArticles from "@features/review/shared/services/useGetAllReviewArticles";
import { StudyInterface } from "@features/review/shared/types/IStudy";
import { useMemo } from "react";
import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { FiltersState } from "@features/review/summarization-graphics/hooks/useGraphicsState";
import LayoutFactoryChart from "@features/review/summarization-graphics/components/tables/ChartTable/LayoutFactoryChart";
import BubbleChart from "@features/review/summarization-graphics/components/charts/BubbleChart";
import useBubbleChartData from "@features/review/summarization-graphics/hooks/useBubbleData";
import DownloadChartsButton from "@features/review/summarization-graphics/components/buttons/DownloadChatsButton";

type Props = {
  section: string;
  type: string;
  filters: FiltersState;
  selectedQuestionId?: string;
};

export default function ChartsRenderer({
  section,
  type,
  filters,
  selectedQuestionId,
}: Props) {
  const { articles, isLoading: isLoadingArticles } = useGetAllReviewArticles();

  const chartId = `chart-${section.replace(/\s+/g, "-").toLowerCase()}`;

  // Filters
  const filteredStudies = useMemo(() => {
    return articles
      .filter((s) => {
        const year = Number(s.year);
        if (filters.startYear && year < filters.startYear) return false;
        if (filters.endYear && year > filters.endYear) return false;
        return true;
      })
      .filter((s) =>
        filters.source && filters.source.length > 0
          ? s.searchSources.some((src) => filters.source!.includes(src))
          : true
      );
  }, [articles, filters.source, filters.startYear, filters.endYear]);

  let content;

  // Group by source
  const sourceCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    filteredStudies.forEach((s) => {
      s.searchSources.forEach((src) => {
        map[src] = (map[src] || 0) + 1;
      });
    });
    return map;
  }, [filteredStudies]);

  switch (section) {
    case "Search Sources":
      if (isLoadingArticles) {
        content = <Text>Loading chart ...</Text>;
        break;
      }

      const labels = Object.keys(sourceCountMap);
      const totalOfStudies = Object.values(sourceCountMap);
      const bubbleData = useBubbleChartData(filteredStudies);

      switch (type) {
        case "Pie Chart":
          content = (
            <Box id={chartId} sx={piechartBox}>
              <PieChart
                title="Search Sources"
                labels={labels}
                data={totalOfStudies}
              />
            </Box>
          );
          break;
        case "Bar Chart":
          content = (
            <Box id={chartId} sx={barchartBox}>
              <BarChart
                title="Search Sources"
                labels={labels}
                data={totalOfStudies}
                section="searchSource"
              />
            </Box>
          );
          break;
        case "Bubble Chart":
          content = (
            <Box id={chartId} sx={piechartBox}>
              <BubbleChart
                title="Search Sources Evolution"
                data={bubbleData}
                yaxisText="Número de estudos"
              />
            </Box>
          );
          break;
        case "Table":
          content = (
            <Box id={chartId}>
              <SearchSorcesTable />
            </Box>
          );
          break;
      }
      break;

    case "S1_Inclusion Criteria":
      content = (
        <Box id={chartId} sx={barchartBox}>
          <CriteriaBarChart
            criteria="inclusion"
            stage="selection"
            filteredStudies={filteredStudies}
          />
        </Box>
      );
      break;

    case "S1_Exclusion Criteria":
      content = (
        <Box id={chartId} sx={barchartBox}>
          <CriteriaBarChart
            criteria="exclusion"
            stage="selection"
            filteredStudies={filteredStudies}
          />
        </Box>
      );
      break;

    case "S2_Inclusion Criteria":
      content = (
        <Box id={chartId} sx={barchartBox}>
          <CriteriaBarChart
            criteria="inclusion"
            stage="extraction"
            filteredStudies={filteredStudies}
          />
        </Box>
      );
      break;

    case "S2_Exclusion Criteria":
      content = (
        <Box id={chartId} sx={barchartBox}>
          <CriteriaBarChart
            criteria="exclusion"
            stage="extraction"
            filteredStudies={filteredStudies}
          />
        </Box>
      );
      break;

    case "Included Studies":
      const includedStudies = useMemo<(StudyInterface | ArticleInterface)[]>(
        () => {
          return filteredStudies
            .filter((study) => study.extractionStatus === "INCLUDED")
            .filter((s): s is StudyInterface =>
              filters.criteria && filters.criteria.length > 0
                ? "criteria" in s
                : true
            )
            .filter((study) =>
              filters.criteria && filters.criteria.length > 0
                ? study.criteria.some((c) => filters.criteria!.includes(c))
                : true
            );
        },
        [filteredStudies, filters.criteria]
      );

      switch (type) {
        case "Table":
          content = (
            <Box id={chartId}>
              <LayoutFactoryChart
                articles={includedStudies as ArticleInterface[]}
                isLoading={isLoadingArticles}
              />
            </Box>
          );
          break;
        case "Line Chart":
          content = (
            <Box id={chartId}>
              <IncludedStudiesLineChart filteredStudies={includedStudies} />
            </Box>
          );
          break;
      }
      break;

    case "Form Questions":
      content = (
        <Box id={chartId}>
          <QuestionsCharts
            selectedQuestionId={selectedQuestionId}
            filteredStudies={filteredStudies as ArticleInterface[]}
            type={type}
          />
        </Box>
      );
      break;

    case "Studies Funnel":
      content = (
        <Box id={chartId} sx={fluxogramaBox}>
          <StudiesFunnelChart />
        </Box>
      );
      break;
  }

return (
  <Box
    position="relative"
    sx={
      section === "Included Studies" && type === "Table"
        ? undefined
        : graphicsconteiner
    }
  >
    {content}

    {section !== "Studies Funnel" && (
      <Box
        position="absolute"
        bottom="1.5rem"
        right="1.5rem"
       
      >
        <DownloadChartsButton fileName={section} selector={`#${chartId}`}/>
      </Box>
    )}
  </Box>
);

}
