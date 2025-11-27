
import { Node, Edge } from "@xyflow/react";
import { Text } from "@chakra-ui/react";


import { useFetchStudiesByStage } from "../../../../services/useFetchStudiesByStage";
import useFetchStudiesByCriteria from "../../../../services/useFetchStudiesByCriteria";
import { useFetchStudiesFunnel } from "../../../../services/useFetchStudiesFunnel";

import FlowChart from "../../../../components/charts/FunnelChart";

const baseNodes: Node[] = [
  {
    id: "0",
    data: { label: "Studies identified in searched sources" },
    position: { x: 200, y: 150 },
  },
  {
    id: "1",
    data: { label: "Studies after removing duplicates" },
    position: { x: 200, y: 250 },
  },
  {
    id: "2",
    data: { label: "Studies screened" },
    position: { x: 200, y: 350 },
  },
  {
    id: "3",
    data: { label: "Studies excluded" },
    position: { x: 400, y: 350 },
  },
  {
    id: "4",
    data: { label: "Full-text studies assessed for eligibility" },
    position: { x: 200, y: 450 },
  },
  {
    id: "5",
    data: { label: "Full-text studies excluded with reasons" },
    position: { x: 480, y: 450 },
  },
  {
    id: "6",
    data: { label: "Studies included in qualitative synthesis" },
    position: { x: 200, y: 550 },
  },
  
];

const edges: Edge[] = [
  { id: "e0_1", source: "0", target: "1", type: "straight" },
  { id: "e1_2", source: "1", target: "2", type: "straight" },
  { id: "e2_3", source: "2", target: "3", type: "straight" },
  { id: "e2_4", source: "2", target: "4", type: "straight" },
  { id: "e4_5", source: "4", target: "5", type: "straight" },
  { id: "e4_6", source: "4", target: "6", type: "straight" },
 
];

export default function StudiesFunnelChart() {
  const { funnelData, isLoading } = useFetchStudiesFunnel();
  const selectionStage = useFetchStudiesByStage("selection").studiesByStage;
  const extractionStage = useFetchStudiesByStage("extraction").studiesByStage;
  const inclusionCriteria  = useFetchStudiesByCriteria("inclusion").studiesByCriteria;
  const exclusionCriteria =
    useFetchStudiesByCriteria("exclusion").studiesByCriteria;

  if (isLoading) return <Text>Loading chart...</Text>;

  // Selection
  const selectionIncludedIds = selectionStage?.includedStudies.ids ?? [];
  const studiesScreenedByCriteria  = [
    ...Object.values(inclusionCriteria?.criteria ?? {}).map(
      (ids) => ids.filter((id) => selectionIncludedIds.includes(id)).length
    ),
    funnelData?.totalScreened ?? 0
  ];

  const selectionExcludedIds = selectionStage?.excludedStudies.ids ?? [];
  const studiesExcludedInScreened = [
    ...Object.values(exclusionCriteria?.criteria ?? {}).map(
      (ids) => ids.filter((id) => selectionExcludedIds.includes(id)).length
    ),
    funnelData?.totalExcludedInScreening ?? 0,
  ];

  // Extraction
  const extractionIncludedIds = extractionStage?.includedStudies.ids ?? [];
  const studiesFullTextByCriteria = [
    ...Object.values(inclusionCriteria?.criteria ?? {}).map(
      (ids) => ids.filter((id) => extractionIncludedIds.includes(id)).length
    ),
    funnelData?.totalFullTextAssessed ?? 0
  ];

  const extractionExcludedIds = extractionStage?.excludedStudies.ids ?? [];
  const studiesExcludedInFullText = [
    ...Object.values(exclusionCriteria?.criteria ?? {}).map(
      (ids) => ids.filter((id) => extractionExcludedIds.includes(id)).length
    ),
    funnelData?.totalExcludedInFullText ?? 0,
  ];

  const totalIdentified = Object.values(
    funnelData?.totalIdentifiedBySource ?? {}
  ).reduce((acc, n) => acc + n, 0);
  const totalAfterDuplicates = Object.values(
    funnelData?.totalAfterDuplicatesRemovedBySource ?? {}
  ).reduce((acc, n) => acc + n, 0);

  const Inicialdata: (number | null | number[])[] = [
    totalIdentified,
    totalAfterDuplicates,
    studiesScreenedByCriteria ?? [],
    studiesExcludedInScreened ?? [],
    studiesFullTextByCriteria ?? [],
    studiesExcludedInFullText ?? [],
    funnelData?.totalIncluded ?? null,
    null,
  ];

  const completedNodes: Node[] = baseNodes.map((node, index) => {
    const value = Inicialdata[index];
    let labelValue = "";

    if (Array.isArray(value)) {
      const criteriasLabel = value
        .slice(0, value.length - 1)
        .map((val, i) => ` (C${i + 1}=${val})`)
        .join(",");

      const totalLabel = `, (total=${value[value.length - 1]})`;
      labelValue = `${criteriasLabel} ${totalLabel}`;
    } else {
      labelValue = value != null ? `(n=${value})` : `(n=?)`;
    }

    return {
      ...node,
      data: {
        ...node.data,
        label: `${node.data.label} ${labelValue}`,
      },
    };
  });

  const sources = Object.entries(funnelData?.totalIdentifiedBySource ?? {});
  const sourceNodeSpacing = 160;
  const startX =
    baseNodes[0].position.x - ((sources.length - 1) * sourceNodeSpacing) / 2;

  const basedStartIndex = completedNodes.length;
  sources.forEach(([source, value], index) => {
    const id = completedNodes.length;
    completedNodes.push({
      id: id.toString(),
      data: {
        label: `${source} (n=${value})`,
      },
      position: {
        x: startX + index * sourceNodeSpacing,
        y: 50,
      },
    });
  });

let edgeCounter = 0;
const dynamicEdges: Edge[] = Array.from(
  { length: completedNodes.length - basedStartIndex },
  (_, i) => {
    const nodeIndex = basedStartIndex + i;
    return {
      id: `e${nodeIndex}_0_${edgeCounter++}`,
      source: nodeIndex.toString(),
      target: "0",
      type: "straight",
    };
  }
);

const allEdges = [...edges, ...dynamicEdges];

  if (isLoading) return <Text>Loading chart...</Text>;

  return <FlowChart baseNodes={completedNodes} edges={allEdges} />;
}
