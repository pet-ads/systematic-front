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
import { useLocation } from "react-router-dom";

// Components
import ProtocolAccordionSubItem from "./AccordionNavItem";

// Hooks
import useStructureReview from "@features/review/planning-protocol/services/useStructureReview";

// Types
type AccordionSection = "Planning" | "Execution" | "Summarization";

// Constants
const hasShowOcultScreens = false;

const sectionIcons: Record<AccordionSection, React.ReactNode> = {
  Planning: <MdRule size="1.25rem" color="black" />,
  Execution: <LuFileSearch size="1.1rem" color="black" />,
  Summarization: <LuFileCheck2 size="1rem" color="black" />,
};

const AccordionComponent = () => {
  const id = localStorage.getItem("systematicReviewId");
  const { generalDefinition, isLoading } = useStructureReview();

  const location = useLocation();

  let currentParentSection = "";
  if (location.pathname.includes("/planning")) {
    currentParentSection = "Planning";
  } else if (location.pathname.includes("/execution")) {
    currentParentSection = "Execution";
  } else if (location.pathname.includes("/summarization")) {
    currentParentSection = "Summarization";
  }

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
    const initial = sectionToIndex[currentParentSection];
    return initial !== undefined ? [initial] : [];
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpenIndexes", JSON.stringify(localIndex));
  }, [localIndex]);

  useEffect(() => {
    const newIndex = sectionToIndex[currentParentSection];
    if (newIndex !== undefined) {
      setLocalIndex((prev) => {
        if (!prev.includes(newIndex)) {
          return [...prev, newIndex];
        }
        return prev;
      });
    }
  }, [currentParentSection]);

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
        { path: `/review/summarization/download`, label: "Download" },
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
    <Accordion
      w="80%"
      allowMultiple
      index={localIndex}
      onChange={(newIndex) => setLocalIndex(newIndex as number[])}
    >
      {Object.entries(sections).map(([section, children]) => (
        <AccordionItem key={section} border="none">
          <h2>
            <AccordionButton
              p=".5rem"
              // Usamos a nossa variável baseada na URL para garantir a cor correta
              fontWeight={currentParentSection === section ? "bold" : "light"}
              bg={currentParentSection === section ? "#dadada" : "transparent"}
              borderRadius=".25rem"
              _hover={{ bg: "#eeeeee" }}
            >
              <Box
                color="black"
                as="span"
                flex="1"
                textAlign="left"
                display="flex"
                gap=".5rem"
              >
                {sectionIcons[section as AccordionSection]}
                {section}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>

          <AccordionPanel paddingInlineEnd={0}>
            {children.map((child) => (
              <ProtocolAccordionSubItem
                key={child.path}
                to={child.path}
                text={child.label}
                disabled={
                  !isLoading && !titleIsFilled && child.label !== "Definition"
                }
              />
            ))}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionComponent;