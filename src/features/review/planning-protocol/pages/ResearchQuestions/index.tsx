// External library
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
} from "@chakra-ui/react";

// Components
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "@components/common/inputs/InputTextArea";
import AddTextTable from "../../components/common/inputs/text/AddTextTable";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";
import useProtocolAccordion from "../../services/useProtocolAccordion";
import ProtocolFormLayout from "../../components/common/protocolForm";

export default function ResearchQuestions() {
  const { researchQuestion, handleChangeResearchQuestion, syncAndNavigate } =
    useCreateProtocol();

  const { showResearchQuestions } = useProtocolAccordion();

  const { justification } = researchQuestion;

  const id = localStorage.getItem("systematicReviewId");

  return (
    <ProtocolFormLayout
      headerText="Protocol: Research Questions"
      formControlProps={{ gap: 1.5 }} 
      navButtons={(
        <>
          <NavButton
            event={() =>
              syncAndNavigate(`/review/planning/protocol/picoc/${id}`)
            }
            text="Back"
          />
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/eligibility-criteria/${id}`
              )
            }
            text="Next"
          />
        </>
      )}
    >
      <TextAreaInput
        value={justification}
        label="Primary question"
        placeholder="Enter review description"
        onChange={(event) =>
          handleChangeResearchQuestion("justification", event.target.value)
        }
      />

      <Accordion
        defaultIndex={showResearchQuestions ? [0] : [-1]}
        allowToggle
        mt={6}
        w="60vw"
      >
        <AccordionItem>
          <h2 style={{ color: "#2E4B6C" }}>
            <AccordionButton>
              <Box flex="1" textAlign="center">
                <Heading size="md">Secondary Questions</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Flex>
              <AddTextTable
                text="Research Questions"
                placeholder="Enter the other Research Questions"
                referencePrefix="RQ"
              />
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </ProtocolFormLayout>
  );
}
