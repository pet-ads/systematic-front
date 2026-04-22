import { useState, useMemo, useEffect } from "react";
import { useFetchExtractionQuestions } from "@features/review/execution-extraction/services/useFetchExtractionQuestions";
import { useFetchRobQuestions } from "@features/review/execution-extraction/services/useFetchRobQuestions";
import { useTranslation } from "react-i18next";

export type FilterType = "Start Year" | "End Year" | "Source" | "Criteria";

export type FiltersState = {
  startYear?: number;
  endYear?: number;
  source?: string[];
  criteria?: string[];
};

export function useGraphicsState() {
  const { t } = useTranslation("review/summarization-graphics");
  // perguntas
  const { questions: extractionQuestions = [] } = useFetchExtractionQuestions();
  const { questions: robQuestions = [] } = useFetchRobQuestions();
  const allQuestions = useMemo(
    () => [...extractionQuestions, ...robQuestions],
    [extractionQuestions, robQuestions],
  );

  const [selectedQuestionId, setSelectedQuestionId] = useState<
    string | undefined
  >(undefined);
  const [section, setSection] = useState("");
  const [type, setType] = useState("");
  const [filters, setFilters] = useState<FiltersState>({});

  const questionAllowedTypes = (questionId?: string) => {
    if (!questionId) return [];
    const question = allQuestions.find((q) => q.questionId === questionId);
    if (!question) return [];

    switch (question.questionType) {
      case "LABELED_SCALE":
      case "NUMBERED_SCALE":
      case "PICK_LIST":
        return [
          t("selectMenu.graphicsTypes.pieChart"),
          t("selectMenu.graphicsTypes.table"),
        ];
      case "PICK_MANY":
        return [
          t("selectMenu.graphicsTypes.barChart"),
          t("selectMenu.graphicsTypes.table"),
        ];
      default:
        return [t("selectMenu.graphicsTypes.table")];
    }
  };

  // tipos por seção
  const allowedTypes: Record<string, string[]> = {
    "Search Sources": [
      t("selectMenu.graphicsTypes.pieChart"),
      t("selectMenu.graphicsTypes.barChart"),
      t("selectMenu.graphicsTypes.bubbleChart"),
      t("selectMenu.graphicsTypes.table"),
    ],
    "S1_Inclusion Criteria": [t("selectMenu.graphicsTypes.barChart")],
    "S1_Exclusion Criteria": [t("selectMenu.graphicsTypes.barChart")],
    "S2_Inclusion Criteria": [t("selectMenu.graphicsTypes.barChart")],
    "S2_Exclusion Criteria": [t("selectMenu.graphicsTypes.barChart")],
    "Studies Funnel": [],
    "Included Studies": [
      t("selectMenu.graphicsTypes.lineChart"),
      t("selectMenu.graphicsTypes.table"),
      t("selectMenu.graphicsTypes.bubbleChart"),
    ],
    "Download Protocol": [],
  };

  const filtersBySection: Record<string, FilterType[]> = {
    "Search Sources": ["Start Year", "End Year", "Source"],
    "S1_Inclusion Criteria": ["Start Year", "End Year", "Source"],
    "S1_Exclusion Criteria": ["Start Year", "End Year", "Source"],
    "S2_Inclusion Criteria": ["Start Year", "End Year", "Source"],
    "S2_Exclusion Criteria": ["Start Year", "End Year", "Source"],
    "Studies Funnel": [],
    "Included Studies": ["Start Year", "End Year", "Source", "Criteria"],
    "Form Questions": ["Start Year", "End Year", "Source"],
    "Download Protocol": [],
  };

  const handleSectionChange = (newSection: string) => {
    setSection(newSection);
    const allowed =
      newSection === "Form Questions"
        ? questionAllowedTypes(selectedQuestionId)
        : allowedTypes[newSection] || [];
    if (allowed.length === 1) setType(allowed[0]);
    else setType(allowed[0] || "");
  };

  const currentAllowedTypes =
    section === "Form Questions"
      ? questionAllowedTypes(selectedQuestionId)
      : allowedTypes[section] || [];

  useEffect(() => {
    if (section === "Form Questions") {
      const allowed = questionAllowedTypes(selectedQuestionId);
      if (allowed.length === 1) {
        setType(allowed[0]);
      } else if (!allowed.includes(type)) {
        setType(allowed[0] || "");
      }
    }
  }, [selectedQuestionId, section, type]);

  return {
    allQuestions,
    selectedQuestionId,
    section,
    type,
    filters,
    filtersBySection,
    currentAllowedTypes,
    setSelectedQuestionId,
    setSection,
    setType,
    setFilters,
    handleSectionChange,
  };
}
