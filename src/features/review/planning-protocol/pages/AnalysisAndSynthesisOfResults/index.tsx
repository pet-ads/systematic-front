// External library
import { Box, FormControl } from "@chakra-ui/react";

// Components
import Header from "@components/structure/Header/Header";
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "@components/common/inputs/InputTextArea";
import FlexLayout from "@components/structure/Flex/Flex";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";

export default function AnalysisAndSynthesisOfResults() {
  const {
    analysisAndSynthesisOfResults,
    handleChangeAnalysisAndSynthesisOfResults,
    syncAndNavigate,
  } = useCreateProtocol();

  const { analysisAndSynthesisProcess } = analysisAndSynthesisOfResults;

  const id = localStorage.getItem("systematicReviewId") || "";

  return (
    <FlexLayout navigationType="Accordion">
      <Header text="Protocol: Analysis And Synthesis Of Results" />
      <FormControl
        m={"20px auto 0"}
        display={"flex"}
        gap={10}
        flexDir={"column"}
        w={"60vw"}
        alignItems={"center"}
      >
        <TextAreaInput
          value={analysisAndSynthesisProcess}
          label="Analysis and Synthesis Method"
          placeholder="Enter your Analysis and Synthesis Method"
          onChange={(event) =>
            handleChangeAnalysisAndSynthesisOfResults(
              "analysisAndSynthesisProcess",
              event.target.value
            )
          }
        />
        <Box
          w={"60vw"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"end"}
        >
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/risk-of-bias-assessment/${id}`
              )
            }
            text="Back"
          />
          <NavButton
            event={() => syncAndNavigate("/review/execution/identification")}
            text="Next"
          />
        </Box>
      </FormControl>
    </FlexLayout>
  );
}
