import { Box } from "@chakra-ui/react";
import { RefObject } from "react";
import { Node, Edge } from "@xyflow/react";
import FunnelChart, { ChartExportHandle } from "../../components/charts/FunnelChart";
import { ConductionExportConfig } from "../../services/exportReviewTypes";

type Props = {
  conduction: ConductionExportConfig;
  funnelNodes: Node[];
  funnelEdges: Edge[];
  chartRefs: Record<string, RefObject<ChartExportHandle | null>>;
};

export default function HiddenExportStage({ conduction, funnelNodes, funnelEdges, chartRefs }: Props) {
  if (!conduction.funnel) return null;
  return (
    <Box position="absolute" left="-9999px" top="-9999px" width="1000px" aria-hidden>
      <Box w="1000px" h="600px">
        <FunnelChart baseNodes={funnelNodes} edges={funnelEdges} ref={chartRefs["funnel"]} />
      </Box>
    </Box>
  );
}