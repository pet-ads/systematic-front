import { TFunction } from "i18next";
import { VisualizationType } from "../services/exportReviewTypes";

export type VisualizationOption = { type: VisualizationType; label: string };

export function getAllowedVisualizations(
  questionType: string,
  t: TFunction
): VisualizationOption[] {
  switch (questionType) {
    case "LABELED_SCALE":
    case "NUMBERED_SCALE":
    case "PICK_LIST":
      return [
        { type: "PIE_CHART", label: t("selectMenu.graphicsTypes.pieChart") },
        { type: "BAR_CHART", label: t("selectMenu.graphicsTypes.barChart") },
        { type: "BUBBLE_CHART", label: t("selectMenu.graphicsTypes.bubbleChart") },
        { type: "TABLE", label: t("selectMenu.graphicsTypes.table") },
      ];
    case "PICK_MANY":
      return [
        { type: "BAR_CHART", label: t("selectMenu.graphicsTypes.barChart") },
        { type: "BUBBLE_CHART", label: t("selectMenu.graphicsTypes.bubbleChart") },
        { type: "ITEM_TABLE", label: t("selectMenu.graphicsTypes.itemTable") },
        { type: "TABLE", label: t("selectMenu.graphicsTypes.table") },
      ];
    default:
      return [{ type: "TABLE", label: t("selectMenu.graphicsTypes.table") }];
  }
}