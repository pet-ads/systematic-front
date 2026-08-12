import { Node, Edge } from "@xyflow/react";
import { Text } from "@chakra-ui/react";
import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";

import FlowChart from "../../../../components/charts/FunnelChart";

type Study = StudyInterface | ArticleInterface;

type Props = {
  filteredStudies: Study[];
};

const baseNodes: Node[] = [
  { id: "0", data: { label: "Studies identified in searched sources" }, position: { x: 200, y: 150 } },
  { id: "1", data: { label: "Studies after removing duplicates" }, position: { x: 200, y: 250 } },
  { id: "2", data: { label: "Studies screened" }, position: { x: 200, y: 350 } },
  { id: "3", data: { label: "Studies excluded" }, position: { x: 400, y: 350 } },
  { id: "4", data: { label: "Full-text studies assessed for eligibility" }, position: { x: 200, y: 450 } },
  { id: "5", data: { label: "Full-text studies excluded with reasons" }, position: { x: 480, y: 450 } },
];

const baseEdges: Edge[] = [
  { id: "e0_1", source: "0", target: "1", type: "straight" },
  { id: "e1_2", source: "1", target: "2", type: "straight" },
  { id: "e2_3", source: "2", target: "3", type: "straight" },
  { id: "e2_4", source: "2", target: "4", type: "straight" },
  { id: "e4_5", source: "4", target: "5", type: "straight" },
];

// Extrai o código do critério, ex: "EC-02: texto..." -> "EC-02"
function getCriteriaCode(criteria: string) {
  const match = criteria.match(/^([A-Za-z]+-\d+)/);
  return match ? match[1] : criteria;
}

function countByCriteria(studies: Study[], stage: string = "EXTRACTION") {
  const counts: Record<string, number> = {};
  studies.forEach((study) => {
    if(stage == "EXTRACTION") {
      (study.extractionCriteria ?? []).forEach((c) => {
        const code = getCriteriaCode(c);
        counts[code] = (counts[code] || 0) + 1;
      });
    } else { 
      (study.selectionCriteria ?? []).forEach((c) => {
        const code = getCriteriaCode(c);
        counts[code] = (counts[code] || 0) + 1;
      });
    }
  });
  return counts;
}

function buildLabel(criteriaCounts: Record<string, number>, total: number) {
  const criteriasLabel = Object.entries(criteriaCounts)
    .map(([code, val]) => ` (${code}=${val})`)
    .join(",");
  return `${criteriasLabel}, (total=${total})`;
}

export default function StudiesFunnelChart({ filteredStudies }: Props) {
  if (!filteredStudies) return <Text>Loading chart...</Text>;

  // 0: identificados por fonte - conta TODAS as ocorrências (antes da dedup)
  const identifiedBySource: Record<string, number> = {};
  filteredStudies.forEach((study) => {
    identifiedBySource[study.searchSources[0]] = (identifiedBySource[study.searchSources[0]] || 0) + 1;
  });
  const totalIdentified = Object.values(identifiedBySource).reduce((a, b) => a + b, 0);

  // 1: após dedup -> cada estudo conta 1x (a lista já é deduplicada por searchSources[0])
  const totalAfterDuplicates = filteredStudies.filter((study) => study.extractionStatus !== "DUPLICATED").length;

  // 2/3: triagem (selection)
  const includedInSelection = filteredStudies.filter((s) => s.selectionStatus === "INCLUDED");
  const excludedInSelection = filteredStudies.filter((s) => s.selectionStatus === "EXCLUDED");
  const totalScreened = totalAfterDuplicates;
  const totalExcludedInScreening = excludedInSelection.length;

  // 4/5: full-text (extraction) - só quem passou pela triagem
  const includedInExtraction = includedInSelection.filter((s) => s.extractionStatus === "INCLUDED");
  const excludedInExtraction = includedInSelection.filter((s) => s.extractionStatus === "EXCLUDED");
  const duplicatedInExtractin = includedInSelection.filter((s) => s.extractionStatus === "DUPLICATED");
  const totalFullTextAssessed = includedInSelection.length - duplicatedInExtractin.length;
  const totalExcludedInFullText = excludedInExtraction.length;

  const totalIncluded = includedInExtraction.length;

  const nodeLabels = [
    `(n=${totalIdentified})`,
    `(n=${totalAfterDuplicates})`,
    buildLabel(countByCriteria(includedInSelection, "SELECTION"), totalScreened),
    buildLabel(countByCriteria(excludedInSelection), totalExcludedInScreening),
    buildLabel(countByCriteria(includedInExtraction), totalFullTextAssessed),
    buildLabel(countByCriteria(excludedInExtraction), totalExcludedInFullText),
    `(n=${totalIncluded})`,
    "",
  ];

  const completedNodes: Node[] = baseNodes.map((node, index) => ({
    ...node,
    data: { ...node.data, label: `${node.data.label} ${nodeLabels[index]}` },
  }));

  // nós dinâmicos das fontes (contagem ANTES da dedup)
  const sources = Object.entries(identifiedBySource);
  const sourceNodeSpacing = 160;
  const startX = baseNodes[0].position.x - ((sources.length - 1) * sourceNodeSpacing) / 2;
  const basedStartIndex = completedNodes.length;

  sources.forEach(([source, value], index) => {
    completedNodes.push({
      id: (basedStartIndex + index).toString(),
      data: { label: `${source} (n=${value})` },
      position: { x: startX + index * sourceNodeSpacing, y: 50 },
    });
  });

  const dynamicEdges: Edge[] = sources.map((_, i) => {
    const nodeIndex = basedStartIndex + i;
    return {
      id: `e${nodeIndex}_0`,
      source: nodeIndex.toString(),
      target: "0",
      type: "straight",
    };
  });

  return <FlowChart baseNodes={completedNodes} edges={[...baseEdges, ...dynamicEdges]} />;
}