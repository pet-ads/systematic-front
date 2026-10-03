import { Text } from "@chakra-ui/react";
import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";
import { useFunnelChartData } from "../../../../hooks/useFunnelChartData";
import FunnelChart from "../../../../components/charts/FunnelChart";

type Props = { filteredStudies: (StudyInterface | ArticleInterface)[] };

export default function StudiesFunnelChart({ filteredStudies }: Props) {
  const { nodes, edges } = useFunnelChartData(filteredStudies);
  if (!filteredStudies) return <Text>Loading chart...</Text>;
  return <FunnelChart baseNodes={nodes} edges={edges} />;
}