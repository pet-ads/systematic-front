import { useCallback, useMemo, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { graphicsconteiner } from "../../styles";

import { FiltersState } from "@features/review/summarization-graphics/hooks/useGraphicsState";

import useGetAllReviewArticles from "@features/review/shared/services/useGetAllReviewArticles";

import SearchSourcesRenderer from "./SearchSourcesRenderer";
import IncludedStudiesRenderer from "./IncludedStudiesRenderer";
import CriteriaRenderer from "./CriteriaRenderer";
import StudiesFunnelRenderer from "./StudiesFunnelRenderer";
import DownloadChartsButton from "@features/review/summarization-graphics/components/buttons/DownloadChatsButton";
import FormQuestionsRenderer from "./FormQuestionsRenderer";
import { downloadCSV } from "@features/review/summarization-graphics/components/export/ExportCsv";
import { getCsvData } from "@features/review/summarization-graphics/components/export/ExportCsv/CsvFactoty/getCsvData";
import useFetchQuestionAnswers from "@features/review/summarization-graphics/services/useFetchQuestionAnwers";
import { buildQuestionsCsv } from "@features/review/summarization-graphics/components/export/ExportCsv/CsvQuestions/buildQuestionsCsv";
import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { useFetchStudiesByStage } from "@features/review/summarization-graphics/services/useFetchStudiesByStage";
import useFetchStudiesByCriteria from "@features/review/summarization-graphics/services/useFetchStudiesByCriteria";

type Props = {
  section: string;
  type: string;
  filters: FiltersState;
  selectedQuestionId?: string;
};
export type CsvRow = Record<string, string | number>;

export default function ChartsRenderer({
  section,
  type,
  filters,
  selectedQuestionId,
}: Props) {
  const { articles, isLoading } = useGetAllReviewArticles();
  const [, setCsvData] = useState<CsvRow[]>([]);

  const { extractionAnswers } = useFetchQuestionAnswers();

  const handleCsvData = useCallback((data: CsvRow[]) => {
    setCsvData(data);
  }, []);

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

  const isCriteriaSection = [
    "S1_Inclusion Criteria",
    "S1_Exclusion Criteria",
    "S2_Inclusion Criteria",
    "S2_Exclusion Criteria",
  ].includes(section);

  let filteredStageIds: number[] | undefined;
  let studiesByCriteria: Record<string, number[]> | undefined;

  if (isCriteriaSection) {
    const [stagePart, criteriaPart] = section.split("_");
    const criteriaType = criteriaPart.replace(" Criteria", "").toLowerCase();
    const stage = stagePart === "S1" ? "selection" : "extraction";

    const { studiesByStage } = useFetchStudiesByStage(stage);
    const { studiesByCriteria: fetchedCriteria } =
      useFetchStudiesByCriteria(criteriaType);

    const stageIds =
      criteriaType === "inclusion"
        ? studiesByStage?.includedStudies?.ids ?? []
        : studiesByStage?.excludedStudies?.ids ?? [];

    const filteredStudiesIds = filteredStudies
      .map((s) =>
        "studyReviewId" in s
          ? s.studyReviewId
          : "studyId" in s
          ? s.studyId
          : null
      )
      .filter((id): id is number => id !== null);

    filteredStageIds = stageIds.filter((id) => filteredStudiesIds.includes(id));
    studiesByCriteria = fetchedCriteria?.criteria;
  }

  if (isLoading) return <Box>Loading...</Box>;

  const chartId = `chart-${section.replace(/\s+/g, "-").toLowerCase()}`;

  // Map de renderers
  const rendererMap: Record<string, any> = {
    "Search Sources": (props: any) => (
      <SearchSourcesRenderer {...props} chartId={chartId} />
    ),
    "Included Studies": (props: any) => (
      <IncludedStudiesRenderer {...props} chartId={chartId} />
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
      />
    ),
    "Studies Funnel": () => <StudiesFunnelRenderer chartId={chartId} />,
  };

  const Renderer = rendererMap[section];
  if (!Renderer) return <Box>Seção não encontrada</Box>;

return (
  <Box
    sx={{
      ...graphicsconteiner,
      minHeight: "calc(100vh - 210px)",
      justifyContent: "space-between",
    }}
  >
    <Box
      display="flex"
      flexWrap="wrap"
      gap="2em"
      justifyContent="center"
      alignItems="center"
      p={
        section === "Included Studies" ||
        (section === "Search Sources" && (type === "Table" || type === "Tabela"))
          ? "0"
          : "2rem"
      }
      pt="1rem"
    >
      <Renderer
        filteredStudies={filteredStudies}
        type={type}
        onCsvData={handleCsvData}
      />
    </Box>

    {section !== "Studies Funnel" && (
      <Flex w="100%" justifyContent="flex-end" p="1rem">
        <DownloadChartsButton
          selector={`#${chartId}`}
          fileName={section}
          onDownloadCsv={() => {
            if (section === "Form Questions") 
              {
              downloadCSV(
                "questions",
                buildQuestionsCsv(
                  extractionAnswers,
                  filteredStudies as ArticleInterface[],
                  selectedQuestionId
                )
              );
            } else {
              downloadCSV(
                section,
                getCsvData(
                  section,
                  filteredStudies,
                  type,
                  filteredStageIds,
                  studiesByCriteria
                )
              );
            }
          }}
        />
      </Flex>
    )}
  </Box>
);
}