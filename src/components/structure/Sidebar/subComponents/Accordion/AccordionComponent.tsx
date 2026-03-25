// External library
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { useMemo, useState, useEffect } from "react";
import { MdRule } from "react-icons/md";
import { LuFileSearch, LuFileCheck2 } from "react-icons/lu";

// Components
import ProtocolAccordionSubItem from "./AccordionNavItem";

// Hooks
import useActiveSection from "@features/shared/hooks/useActiveSection";
import useStructureReview from "@features/review/planning-protocol/services/useStructureReview";

// Types
type AccordionSection = "Planning" | "Execution" | "Summarization";

// Constants
const hasShowOcultScreens = false;


const sectionIcons: Record<AccordionSection, React.ReactNode> = {
  Planning: <MdRule size="20px" />,
  Execution: <LuFileSearch size="20px" />,
  Summarization: <LuFileCheck2 size="20px" />,
};

const AccordionComponent = () => {
  const id = localStorage.getItem("systematicReviewId");
  const { activeSection } = useActiveSection();
  const { generalDefinition, isLoading } = useStructureReview();

  const sectionToIndex: Record<string, number> = {
    Planning: 0,
    Execution: 1,
    Summarization: 2,
  };

  const [localIndex, setLocalIndex] = useState<number[]>(() => {
    const saved = localStorage.getItem("sidebarOpenIndexes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    const initial = sectionToIndex[activeSection as string];
    return initial !== undefined ? [initial] : [];
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpenIndexes", JSON.stringify(localIndex));
  }, [localIndex]);

  useEffect(() => {
    const newIndex = sectionToIndex[activeSection as string];
    if (newIndex !== undefined) {
      setLocalIndex((prev) => {
        if (!prev.includes(newIndex)) {
          return [...prev, newIndex];
        }
        return prev;
      });
    }
  }, [activeSection]);

  const titleIsFilled = !!generalDefinition?.title?.trim();

  const sections = useMemo(
    () => ({
      Planning: [
        {
          path: `/review/planning/protocol/general-definition`,
          label: "Definition",
        },
        { path: `/review/planning/protocol/picoc/${id}`, label: "PICOC" },
        {
          path: `/review/planning/protocol/research-questions/${id}`,
          label: "Research",
        },
        {
          path: `/review/planning/protocol/eligibility-criteria/${id}`,
          label: "Criteria",
        },
        {
          path: `/review/planning/protocol/information-sources-and-search-strategy/${id}`,
          label: "Sources",
        },
        {
          path: `/review/planning/protocol/selection-and-extraction/${id}`,
          label: "Selection",
        },
        {
          path: `/review/planning/protocol/risk-of-bias-assessment/${id}`,
          label: "Risk of Bias",
        },
        {
          path: `/review/planning/protocol/analysis-and-synthesis-of-results/${id}`,
          label: "Analysis",
        },
      ],
      Execution: [
        { path: `/review/execution/identification`, label: "Identification" },
        { path: `/review/execution/selection`, label: "Selection" },
        { path: `/review/execution/extraction`, label: "Extraction" },
      ],
      Summarization: [
        { path: `/review/summarization/graphics`, label: "Graphics" },
        ...(hasShowOcultScreens
          ? [
              {
                path: `/review/summarization/visualization`,
                label: "Visualization",
              },
              {
                path: `/review/summarization/finalization`,
                label: "Finalization",
              },
            ]
          : []),
      ],
    }),
    [id],
  );

  return (
    <Accordion w="80%" allowMultiple index={localIndex} onChange={(newIndex) => setLocalIndex(newIndex as number[])}>
      {Object.entries(sections).map(([section, children]) => (
        <AccordionItem key={section} border="none">
          <h2>
            <AccordionButton
              p=".5rem"
              fontWeight={activeSection === section ? "bold" : "light"}
              bg={activeSection === section ? "#dadada" : "transparent"}
              borderRadius=".25rem"
              _hover={{ bg: "#eeeeee" }}
            >
              <Box
                as="span"
                flex="1"
                textAlign="left"
                display="flex"
                alignItems="center"
                gap="12px" 
              >
                {sectionIcons[section as AccordionSection]}
                {section}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          
          <AccordionPanel paddingInlineEnd={0} paddingLeft="48px" pb={2} pt={1}>
            {children.map((child) => (
              <ProtocolAccordionSubItem
                key={child.path}
                to={child.path}
                text={child.label}
                disabled={!isLoading && !titleIsFilled && child.label !== "Definition"}
              />
            ))}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionComponent;