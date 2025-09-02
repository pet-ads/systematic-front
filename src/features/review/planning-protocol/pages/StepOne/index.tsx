// External library
import {
  Box,
  FormControl,
  Flex,
  Progress,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Divider,
} from "@chakra-ui/react";

// Services
import useProtocolAccordion from "../../services/useProtocolAccordion";
import useCreatePortocol from "../../services/useCreateProtocol";

// Components
import Header from "../../../../../components/structure/Header/Header";
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "../../../../../components/common/inputs/InputTextArea";
import FlexLayout from "../../../../../components/structure/Flex/Flex";
import AddTextTable from "../../components/common/inputs/text/AddTextTable";

// Styles
import { btnBox, formControl } from "./styles";

export default function Protocol() {
  const {
    goal,
    picoc,
    researchQuestion,
    setGoal,
    handleChangeResearchQuestion,
    handleChangePicoc,
    syncAndNavigate,
  } = useCreatePortocol();

  const { showResearchQuestions, loading, showPicoc } = useProtocolAccordion();
  const { population, intervention, control, outcome, context } = picoc;
  const { justification } = researchQuestion;

  const id = localStorage.getItem("systematicReviewId") || "";

  if (loading) return <></>;

  return (
    <FlexLayout defaultOpen={0} navigationType="Accordion">
      <Box w={"100%"}>
        <Header text="Protocol" />
        <Progress value={33} w={"100%"} />
        <Flex
          w={"100%"}
          justifyContent={"center"}
          direction={"column"}
          alignItems={"center"}
        >
          <FormControl sx={formControl}>
            <TextAreaInput
              value={goal}
              label="Objectives:"
              placeholder="What are your goals?"
              onChange={(e) => {
                setGoal(e.target.value);
              }}
            />
            <TextAreaInput
              value={justification}
              label="Primary question:"
              placeholder="The reason behind your research..."
              onChange={(e) => {
                handleChangeResearchQuestion("justification", e.target.value);
              }}
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

            <Accordion
              defaultIndex={showPicoc ? [0] : [-1]}
              allowToggle
              mt={6}
              w="60vw"
            >
              <AccordionItem>
                <h2 style={{ color: "#2E4B6C" }}>
                  <AccordionButton>
                    <Box flex="1" textAlign="center">
                      <Heading size="md">PICOC Criteria</Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>

                <AccordionPanel pb={4}>
                  <Divider mb={4} />
                  <TextAreaInput
                    value={population}
                    label="Population:"
                    placeholder="What is your study population?"
                    onChange={(event) => {
                      handleChangePicoc("population", event.target.value);
                    }}
                  />
                  <TextAreaInput
                    value={intervention}
                    label="Intervention:"
                    placeholder="What is your intervention?"
                    onChange={(event) => {
                      handleChangePicoc("intervention", event.target.value);
                    }}
                  />
                  <TextAreaInput
                    value={control}
                    label="Control:"
                    placeholder="What is your control?"
                    onChange={(event) => {
                      handleChangePicoc("control", event.target.value);
                    }}
                  />
                  <TextAreaInput
                    value={outcome}
                    label="Outcome:"
                    placeholder="What is your outcome?"
                    onChange={(event) => {
                      handleChangePicoc("outcome", event.target.value);
                    }}
                  />
                  <TextAreaInput
                    value={context}
                    label="Context:"
                    placeholder="What is your context?"
                    onChange={(event) => {
                      handleChangePicoc("context", event.target.value);
                    }}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </FormControl>

          <Box sx={btnBox}>
            <NavButton
              event={() =>
                syncAndNavigate(`/review/planning/protocol/general-definition`)
              }
              text="Back"
            />
            <NavButton
              event={() =>
                syncAndNavigate(`/review/planning/protocol-part-II/${id}`)
              }
              text="Next"
            />
          </Box>
        </Flex>
      </Box>
    </FlexLayout>
  );
}
