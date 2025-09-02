// External library
import { Progress, FormControl, Box } from "@chakra-ui/react";

// Components
import Header from "../../../../../components/structure/Header/Header";
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "../../../../../components/common/inputs/InputTextArea";
import InteractiveTable from "./subcomponents/tables/InteractiveTable";
import FlexLayout from "../../../../../components/structure/Flex/Flex";

// Services
import useCreateProtocol from "../../services/useCreateProtocol";

// Styles
import { buttonBox, formControl } from "./styles";

export default function ProtocolPartThree() {
  const {
    analysisAndSynthesisOfResults,
    handleChangeAnalysisAndSynthesisOfResults,
    syncAndNavigate,
  } = useCreateProtocol();

  const { analysisAndSynthesisProcess } = analysisAndSynthesisOfResults;

  const id = localStorage.getItem("systematicReviewId") || "";
  const url = `http://localhost:8080/systematic-study/${id}/protocol`;

  return (
    <FlexLayout defaultOpen={0} navigationType="Accordion">
      <Box
        w={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Header text="Protocol" />
        <Progress value={100} w={"100%"} />

        <FormControl sx={formControl}>
          <InteractiveTable id={id} url={url} label={"Extraction Questions"} />

          <TextAreaInput
            value={analysisAndSynthesisProcess}
            label="Analysis and Synthesis"
            placeholder="Enter your analysis"
            onChange={(event) =>
              handleChangeAnalysisAndSynthesisOfResults(
                "analysisAndSynthesisProcess",
                event.target.value
              )
            }
          />

          <InteractiveTable
            id={id}
            url={url}
            label={"Risk of Bias Questions"}
          />
        </FormControl>

        <Box sx={buttonBox}>
          <NavButton
            text="Back"
            event={() =>
              syncAndNavigate(`/review/planning/protocol-part-II/${id}`)
            }
          />
          <NavButton
            text="Save"
            event={() => syncAndNavigate("/review/execution/identification")}
            w={"fit-content"}
          />
        </Box>
      </Box>
    </FlexLayout>
  );
}
