// External library
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";

import { TbAsterisk } from "react-icons/tb";
import { MdOutlineSource } from "react-icons/md";
import {
  MdDescription,
  MdHelpOutline,
  MdCategory,
  MdChecklist,
  MdBarChart,
} from "react-icons/md";
import { MdRule } from "react-icons/md";
import { LuFileSearch, LuFileCheck2, LuTextSelect } from "react-icons/lu";
import { CgCheckR } from "react-icons/cg";
import { IoBarChartSharp } from "react-icons/io5";
import { GrTag } from "react-icons/gr";
import { TbFilterSearch } from "react-icons/tb";
import { VscOpenPreview } from "react-icons/vsc";

// Components
import ProtocolAccordionSubItem from "./AccordionNavItem";

const AccordionComponent = () => {
  const id = localStorage.getItem("systematicReviewId");

  return (
    <Accordion w="80%" allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton p="1.2vw 1vh" color="white">
            <Box
              color="#c9d9e5"
              as="span"
              flex="1"
              textAlign="left"
              display="flex"
              gap=".5rem"
            >
              <MdRule size="1.25rem" color="#c9d9e5" />
              Planning
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <ProtocolAccordionSubItem
            icon={<MdDescription size="1.2rem" color="#c9d9e5" />}
            to={`/review/planning/protocol/general-definition`}
            text="Definition"
          />

          <ProtocolAccordionSubItem
            icon={<MdHelpOutline size="1.2rem" color="#c9d9e5" />}
            to={`/review/planning/protocol/research-questions/${id}`}
            text="Research"
          />

          <ProtocolAccordionSubItem
            icon={<MdCategory size="1.2rem" color="#c9d9e5" />}
            to={`/review/planning/protocol/picoc/${id}`}
            text="Picoc"
          />

          <ProtocolAccordionSubItem
            icon={<MdRule size="1.2rem" color="#c9d9e5" />}
            to={`/review/planning/protocol/eligibility-criteria/${id}`}
            text="Criteria"
          />

          <ProtocolAccordionSubItem
            icon={<MdOutlineSource size="1.2rem" color="#c9d9e5" />}
            to={`/review/planning/protocol/information-sources-and-search-strategy/${id}`}
            text="Sources"
          />

          <ProtocolAccordionSubItem
            icon={<MdChecklist size="1.2rem" color="#c9d9e5" />}
            to={`/review/planning/protocol/selection-and-extraction/${id}`}
            text="Selection And Extraction"
          />

          <ProtocolAccordionSubItem
            icon={<TbAsterisk size="1.2rem" color="#c9d9e5" />}
            to={`/review/planning/protocol/risk-of-bias-assessment/${id}`}
            text="Risk Of Bias"
          />

          <ProtocolAccordionSubItem
            icon={<MdBarChart size="1.2rem" color="#c9d9e5" />}
            to={`/review/planning/protocol/analysis-and-synthesis-of-results/${id}`}
            text="Analysys"
          />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton p="1.2vw 1vh" color="white">
            <Box
              color="#c9d9e5"
              as="span"
              flex="1"
              textAlign="left"
              display="flex"
              gap=".5rem"
            >
              <LuFileSearch size="1.1rem" color="#c9d9e5" />
              Execution
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <ProtocolAccordionSubItem
            icon={<GrTag size="1rem" color="#c9d9e5" />}
            to={`/review/execution/identification`}
            text="Identification"
          />
          <ProtocolAccordionSubItem
            icon={<LuTextSelect size="1.2rem" color="#c9d9e5" />}
            to={`/review/execution/selection`}
            text="Selection"
          />
          <ProtocolAccordionSubItem
            icon={<TbFilterSearch size="1.2rem" color="#c9d9e5" />}
            to={`/review/execution/extraction`}
            text="Extraction"
          />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton p="1.2vw 1vh" color="white">
            <Box
              color="#c9d9e5"
              as="span"
              flex="1"
              textAlign="left"
              display="flex"
              gap=".5rem"
            >
              <LuFileCheck2 size="1rem" color="#c9d9e5" />
              Summarization
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <ProtocolAccordionSubItem
            icon={<IoBarChartSharp size="1rem" color="#c9d9e5" />}
            to={`/review/summarization/graphics`}
            text="Graphics"
          />
          <ProtocolAccordionSubItem
            icon={<VscOpenPreview size="1.2rem" color="#c9d9e5" />}
            to={`/review/summarization/visualization`}
            text="Visualization"
          />
          <ProtocolAccordionSubItem
            icon={<CgCheckR size="1rem" color="#c9d9e5" />}
            to={`/review/summarization/finalization`}
            text="Finalization"
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionComponent;
