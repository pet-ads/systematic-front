// External library
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  FormControl,
  Heading,
} from "@chakra-ui/react";

// Components
import Header from "@components/structure/Header/Header";
import NavButton from "@components/common/buttons/NavigationButton";
import InputTextArea from "@components/common/inputs/InputTextArea";
import FlexLayout from "@components/structure/Flex/Flex";
import AddTextTable from "../../components/common/inputs/text/AddTextTable";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";
import useProtocolAccordion from "../../services/useProtocolAccordion";

export default function ResearchQuestions() {
  const { researchQuestion, handleChangeResearchQuestion, syncAndNavigate } =
    useCreateProtocol();

  const { showResearchQuestions } = useProtocolAccordion();

  const { justification } = researchQuestion;

  const id = localStorage.getItem("systematicReviewId");

  return (
    <FlexLayout navigationType="Accordion">
      <Header text="Protocol: Research Questions" />

      <FormControl
        m={"20px auto 0"}
        display={"flex"}
        gap={10}
        flexDir={"column"}
        w={"60vw"}
        alignItems={"center"}
      >
        <InputTextArea
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
                />
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Box
          w={"60vw"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"end"}
        >
          <NavButton
            event={() =>
              syncAndNavigate(`/review/planning/protocol/general-definition`)
            }
            text="Back"
          />
          <NavButton
            event={() =>
              syncAndNavigate(`/review/planning/protocol/picoc/${id}`)
            }
            text="Next"
          />
        </Box>
      </FormControl>
    </FlexLayout>
  );
}
