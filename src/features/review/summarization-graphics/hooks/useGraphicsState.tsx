import { useState, useMemo, useEffect } from "react";
import { useFetchExtractionQuestions } from "@features/review/execution-extraction/services/useFetchExtractionQuestions";
import { useFetchRobQuestions } from "@features/review/execution-extraction/services/useFetchRobQuestions";

 export type FilterType = "Start Year" | "End Year" | "Source" | "Criteria";

export type FiltersState = {
  startYear?: number;
  endYear?: number;
  source?: string[];
  criteria?:string[];
};

export function useGraphicsState() {
  //perguntas
  const { questions: extractionQuestions = [] } = useFetchExtractionQuestions();
  const { questions: robQuestions = [] } = useFetchRobQuestions();
  const allQuestions = useMemo(
    () => [...extractionQuestions, ...robQuestions],
    [extractionQuestions, robQuestions]
  );

  // estados principais
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | undefined>(
    allQuestions[0]?.questionId ?? undefined
  );
  const [section, setSection] = useState("Included Studies");
  const [type, setType] = useState("Table");
  const [filters, setFilters] = useState<FiltersState>({});


  const questionAllowedTypes = (questionId?: string) => {
  if (!questionId) return [];
  const question = allQuestions.find(q => q.questionId === questionId);
  if (!question) return [];

  switch (question.questionType) {
    case "LABELED_SCALE":
    case "NUMBERED_SCALE":
    case "PICK_LIST":
      return ["Pie Chart", "Table"];
    case "PICK_MANY":
      return ["Bar Chart", "Table"];
    default:
      return ["Table"]; // TEXTUAL ou outros
  }
};

  // tipos por seção
  const allowedTypes: Record<string, string[]> = {
    "Search Sources": ["Pie Chart", "Bar Chart","Bubble Chart", "Table"],
    "S1_Inclusion Criteria": ["Bar Chart"],
    "S1_Exclusion Criteria": ["Bar Chart"],
    "S2_Inclusion Criteria": ["Bar Chart"],
    "S2_Exclusion Criteria": ["Bar Chart"],
    "Studies Funnel": [],
    "Included Studies": ["Line Chart", "Table"],
  };

  const filtersBySection: Record<string, FilterType[]> = {
    "Search Sources": ["Start Year", "End Year", "Source"],
    "S1_Inclusion Criteria": ["Start Year", "End Year", "Source"],
    "S1_Exclusion Criteria": ["Start Year", "End Year", "Source"],
    "S2_Inclusion Criteria": ["Start Year", "End Year", "Source"],
    "S2_Exclusion Criteria": ["Start Year", "End Year", "Source"],
    "Studies Funnel": [],
    "Included Studies": ["Start Year", "End Year", "Source","Criteria"],
    "Form Questions": ["Start Year", "End Year", "Source"],
  };

  const handleSectionChange = (newSection: string) => {
    setSection(newSection);
    const allowed = newSection === "Form Questions" ? questionAllowedTypes(selectedQuestionId) : allowedTypes[newSection] || [];
    if (allowed.length === 1) setType(allowed[0]);
    else setType(allowed[0] || "");
  };

 const currentAllowedTypes = section === "Form Questions" 
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
}, [selectedQuestionId, section]);
 
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
