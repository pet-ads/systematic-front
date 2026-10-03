export type VisualizationType =
  | "PIE_CHART"
  | "BAR_CHART"
  | "BUBBLE_CHART"
  | "LINE_CHART"
  | "TABLE"
  | "ITEM_TABLE";

export type ConductionExportConfig = {
  includedInFirstSelection: boolean;
  excludedInFirstSelection: boolean;
  includedInSecondSelection: boolean;
  excludedInSecondSelection: boolean;
  consolidatedExtraction: boolean;
  funnel: boolean;
};

export const defaultConductionConfig: ConductionExportConfig = {
  includedInFirstSelection: false,
  excludedInFirstSelection: false,
  includedInSecondSelection: false,
  excludedInSecondSelection: false,
  consolidatedExtraction: true,
  funnel: true,
};

export type ExportItemConfig = {
  questionId: string;
  visualization: VisualizationType;
};
