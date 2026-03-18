// External library
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
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

  const { generalDefinition } = useStructureReview();
  const titleIsFilled = generalDefinition.title && generalDefinition.title.trim() !== "";

  const sections: Record<
    AccordionSection,
    {
      path: string;
      label: string;
    }[]
  > = {
    Planning: [
      { path: `/review/planning/protocol/general-definition`, label: "Definition" },
      { path: `/review/planning/protocol/picoc/${id}`, label: "PICOC" },
      { path: `/review/planning/protocol/research-questions/${id}`, label: "Research" },
      { path: `/review/planning/protocol/eligibility-criteria/${id}`, label: "Criteria" },
      { path: `/review/planning/protocol/information-sources-and-search-strategy/${id}`, label: "Sources" },
      { path: `/review/planning/protocol/selection-and-extraction/${id}`, label: "Selection" },
      { path: `/review/planning/protocol/risk-of-bias-assessment/${id}`, label: "Risk of Bias" },
      { path: `/review/planning/protocol/analysis-and-synthesis-of-results/${id}`, label: "Analysis" },
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
            { path: `/review/summarization/visualization`, label: "Visualization" },
            { path: `/review/summarization/finalization`, label: "Finalization" },
          ]
        : []),
    ],
  };

  const sectionToIndex: Record<string, number> = {
    Planning: 0,
    Execution: 1,
    Summarization: 2,
  };

  const [localIndex, setLocalIndex] = useState<number | number[]>(
    sectionToIndex[activeSection as string] ?? -1,
  );

  useEffect(() => {
    const newIndex = sectionToIndex[activeSection as string] ?? -1;
    setLocalIndex(newIndex);
  }, [activeSection]);

  return (
    
    <Accordion w="100%" allowToggle index={localIndex} onChange={(expandedIndex) => setLocalIndex(expandedIndex)}>
      {Object.entries(sections).map(([section, children]) => (
        <AccordionItem key={section} border="none">
          <h2>
            <AccordionButton
              padding="10px 16px"
              paddingLeft="36px" 
              _hover={{ bg: "#f7fafc" }}
              _focus={{ boxShadow: "none", outline: "none" }} 
              bg="transparent" 
              color={activeSection === section ? "#3182CE" : "#4A4A4A"} 
              fontWeight={activeSection === section ? "600" : "500"}
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
                disabled={!titleIsFilled && child.label !== "Definition"}
              />
            ))}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionComponent;