import { useCallback, useMemo } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { graphicsconteiner } from "../../styles";

import { FiltersState } from "@features/review/summarization-graphics/hooks/useGraphicsState";
import useGetAllReviewArticles from "@features/review/shared/services/useGetAllReviewArticles";

import SearchSourcesRenderer from "./SearchSourcesRenderer";
import IncludedStudiesRenderer from "./IncludedStudiesRenderer";
import CriteriaRenderer from "./CriteriaRenderer";
import StudiesFunnelRenderer from "./StudiesFunnelRenderer";
import ProtocolRenderer from "./ProtocolRenderer";
import FormQuestionsRenderer from "./FormQuestionsRenderer";
import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";
import { PageLayout } from "@features/review/shared/components/structure/LayoutFactory";
import { Dispatch, SetStateAction } from "react";

type Props = {
  section: string;
  type: string;
  filters: FiltersState;
  selectedQuestionId?: string;
  columnsVisible: ColumnVisibility;
  setTablePage: Dispatch<SetStateAction<PageLayout>>;
};
export type CsvRow = Record<string, string | number>;

export default function ChartsRenderer({
  section,
  type,
  filters,
  selectedQuestionId,
  columnsVisible,
  setTablePage,
}: Props) {
  const { articles, isLoading } = useGetAllReviewArticles();

  const handleCsvData = useCallback((_data: CsvRow[]) => {}, []);

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

  if (isLoading) return <Box>Loading...</Box>;

  const chartId = `chart-${section.replace(/\s+/g, "-").toLowerCase()}`;

  const rendererMap: Record<string, any> = {
    "Search Sources": (props: any) => (
      <SearchSourcesRenderer {...props} columnsVisible={columnsVisible} chartId={chartId} />
    ),
    "Included Studies": (props: any) => (
      <IncludedStudiesRenderer {...props} columnsVisible={columnsVisible} chartId={chartId} />
    ),
    "S1_Inclusion Criteria": (props: any) => (
      <CriteriaRenderer
        {...props}
        stage="selection"
        criteria="inclusion"
        chartId={chartId}
      />
    ),
    "S1_Exclusion Criteria": (props: any) => (
      <CriteriaRenderer
        {...props}
        stage="selection"
        criteria="exclusion"
        chartId={chartId}
      />
    ),
    "S2_Inclusion Criteria": (props: any) => (
      <CriteriaRenderer
        {...props}
        stage="extraction"
        criteria="inclusion"
        chartId={chartId}
      />
    ),
    "S2_Exclusion Criteria": (props: any) => (
      <CriteriaRenderer
        {...props}
        stage="extraction"
        criteria="exclusion"
        chartId={chartId}
      />
    ),
    "Form Questions": (props: any) => (
      <FormQuestionsRenderer
        {...props}
        chartId={chartId}
        selectedQuestionId={selectedQuestionId}
        columnsVisible={columnsVisible}
        setTablePage={setTablePage}
      />
    ),
    "Studies Funnel": () => <StudiesFunnelRenderer filteredStudies={filteredStudies} chartId={chartId} />,
    Protocol: () => <ProtocolRenderer />,
  };

  const Renderer = rendererMap[section];
  if (!Renderer) return <Box>Seção não encontrada</Box>;

  const isTableView =
    type === "Table" ||
    type === "Tabela" ||
    type === "Item Table" ||
    type === "Tabela por Item";

  return (
    <Flex
      flex="1"
      w="100%"
      h="100%"
      minH={0}
      direction="column"
      mt="0px"
      position="relative"
      justify={isTableView ? "flex-start" : "center"}
      sx={{
        ...graphicsconteiner,
      }}
    >
      <Box flex="1" w="100%" h="100%" minH={0} overflow="hidden" display="flex" flexDirection="column">
        <Renderer
          filteredStudies={filteredStudies}
          type={type}
          onCsvData={handleCsvData}
        />
      </Box>
    </Flex>
  );
}