// External library
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Types
type Section = "Planning" | "Execution" | "Summarization" | null;

// Constants
const sectionsMap: Record<Exclude<Section, null>, string[]> = {
  Planning: [
    "/review/planning/protocol/general-definition",
    "/review/planning/protocol/research-questions",
    "/review/planning/protocol/picoc",
    "/review/planning/protocol/eligibility-criteria",
    "/review/planning/protocol/information-sources-and-search-strategy",
    "/review/planning/protocol/selection-and-extraction",
    "/review/planning/protocol/risk-of-bias-assessment",
    "/review/planning/protocol/analysis-and-synthesis-of-results",
    "/review/planning/protocol/review-collaborators",
  ],
  Execution: [
    "/review/execution/identification",
    "/review/execution/selection",
    "/review/execution/extraction",
  ],
  Summarization: [
    "/review/summarization/graphics",
    "/review/summarization/visualization",
    "/review/summarization/finalization",
  ],
};

export default function useActiveSection() {
  const [activeSection, setActiveSection] = useState<Section>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname) return;

    for (const [section, paths] of Object.entries(sectionsMap)) {
      if (paths.some((value) => pathname.startsWith(value))) {
        setActiveSection(section as Section);
        break;
      }
    }
  }, [pathname]);

  return { activeSection, pathname };
}
