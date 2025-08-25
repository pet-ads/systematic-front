// External library
import { useEffect } from "react";
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
    handleDataAndGoNext,
    handleDataAndReturn,
    setGoal,
    setJustification,
    setPopulation,
    setIntervention,
    setControl,
    setOutcome,
    setContext,
    goal,
    justification,
    population,
    intervention,
    control,
    outcome,
    context,
    setFlag,
  } = useCreatePortocol();

  const { showResearchQuestions, loading, showPicoc } = useProtocolAccordion();

  useEffect(() => {
    setFlag("protocol");
  }, []);

  if (loading) return <></>;

  return (
    <FlexLayout navigationType="Accordion">
      <Box w="100%" px="1rem" py="1rem" h="fit-content">
        <Flex
          w="100%"
          h="2.5rem"
          alignItems="center"
          mb="2rem"
        >
          <Header text="Protocol" />
        </Flex>
        <Progress value={33} w="100%" />
      </Box>
      <Box w="100%" px="1rem">
        <Flex
          w="100%"
          justifyContent="center"
          direction="column"
          alignItems="center"
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
                setJustification(e.target.value);
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
                    onChange={(e) => {
                      setPopulation(e.target.value);
                    }}
                    mt={4}
                  />
                  <TextAreaInput
                    value={intervention}
                    label="Intervention:"
                    placeholder="What is your intervention?"
                    onChange={(e) => {
                      setIntervention(e.target.value);
                    }}
                    mt={4}
                  />
                  <TextAreaInput
                    value={control}
                    label="Control:"
                    placeholder="What is your control?"
                    onChange={(e) => {
                      setControl(e.target.value);
                    }}
                    mt={4}
                  />
                  <TextAreaInput
                    value={outcome}
                    label="Outcome:"
                    placeholder="What is your outcome?"
                    onChange={(e) => {
                      setOutcome(e.target.value);
                    }}
                    mt={4}
                  />
                  <TextAreaInput
                    value={context}
                    label="Context:"
                    placeholder="What is your context?"
                    onChange={(e) => {
                      setContext(e.target.value);
                    }}
                    mt={4}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </FormControl>

          <Box sx={btnBox}>
            <NavButton event={handleDataAndReturn} text="Back" />
            <NavButton event={handleDataAndGoNext} text="Next" />
          </Box>
        </Flex>
      </Box>
    </FlexLayout>
  );
}
