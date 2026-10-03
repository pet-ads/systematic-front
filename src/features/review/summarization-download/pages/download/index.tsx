import { Box, Button, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState, createRef } from "react";
import { useTranslation } from "react-i18next";

import Header from "@components/structure/Header/Header";
import FlexLayout from "@components/structure/Flex/Flex";
import CardDefault from "@components/common/cards";

import ConductionExportSection from "@features/review/summarization-graphics/components/export/ConductionExportSection";
import ExportItemsSection from "@features/review/summarization-graphics/components/export/ExportItemsSection";
import HiddenExportStage from "@features/review/summarization-graphics/components/export/HiddenExportStage";
import { ExportStageErrorBoundary } from "@features/review/summarization-graphics/components/export/ExportStageErrorBoundary";
import { useExportReview } from "@features/review/summarization-graphics/services/useExportReview";
import { useGraphicsState } from "@features/review/summarization-graphics/hooks/useGraphicsState";
import { useFunnelChartData } from "@features/review/summarization-graphics/hooks/useFunnelChartData";
import useGetAllReviewArticles from "@features/review/shared/services/useGetAllReviewArticles";
import {
  ConductionExportConfig, defaultConductionConfig, ExportItemConfig,
} from "@features/review/summarization-graphics/services/exportReviewTypes";
import { ChartExportHandle } from "@features/review/summarization-graphics/components/charts/FunnelChart";

import useWindowWidth from "@features/shared/hooks/useWindowWidth";
import AppContext from "@features/shared/context/ApplicationContext";

export default function Download() {
  const window = useWindowWidth();
  const context = useContext(AppContext);
  const toast = useToast();
  const { t } = useTranslation("review/summarization-download");

  const { allQuestions } = useGraphicsState();
  const { exportReview, isLoading, error } = useExportReview();
  const { articles: allStudies, isLoading: isLoadingStudies } = useGetAllReviewArticles();

  const { nodes: funnelNodes, edges: funnelEdges } = useFunnelChartData(allStudies);

  const exportableQuestions = allQuestions.filter(
    (q): q is typeof q & { questionId: string; questionType: string } =>
      q.questionId != null && q.questionType != null
  );

  const [conduction, setConduction] = useState<ConductionExportConfig>(defaultConductionConfig);
  const [exportItems, setExportItems] = useState<ExportItemConfig[]>([]);

  const chartRefsMap = useRef<Record<string, React.RefObject<ChartExportHandle | null>>>({});
  const getRef = (key: string) => {
    if (!chartRefsMap.current[key]) chartRefsMap.current[key] = createRef<ChartExportHandle>();
    return chartRefsMap.current[key];
  };
  exportItems.forEach((item) => getRef(item.questionId));
  if (conduction.funnel) getRef("funnel");

  useEffect(() => {
    if (window < 1000 && context?.sidebarState === "open") context.setSidebarState("collapsed");
  }, []);

  if (!context) return null;

  const handleExport = async () => {
    try {
      await exportReview(conduction, exportItems, chartRefsMap.current);
      toast({ title: "Revisão exportada com sucesso", status: "success" });
    } catch (e) {
      toast({ title: "Erro ao exportar revisão", status: "error" });
    }
  };

  return (
    <FlexLayout navigationType="Accordion">
      <Header text={t("header")} />
      <CardDefault backgroundColor="#fff" borderRadius="1rem" withShadow={false}>
        <Box w="100%" px="2rem" py="1.5rem" minH="calc(100vh - 130px)" display="flex" flexDirection="column" gap="2rem">
          <ConductionExportSection config={conduction} onChange={setConduction} />
          <ExportItemsSection questions={exportableQuestions} items={exportItems} onChange={setExportItems} />

          <Button
            colorScheme="blue"
            alignSelf="flex-start"
            isLoading={isLoading}
            isDisabled={isLoadingStudies}
            onClick={handleExport}
          >
            {t("button")}
          </Button>
          {error && <Box color="red.500">{error}</Box>}
        </Box>
      </CardDefault>
      <ExportStageErrorBoundary>
        <HiddenExportStage
          conduction={conduction}
          funnelNodes={funnelNodes}
          funnelEdges={funnelEdges}
          chartRefs={chartRefsMap.current}
        />
      </ExportStageErrorBoundary>
    </FlexLayout>
  );
}