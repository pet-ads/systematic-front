// External library
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Progress, FormControl, Box } from "@chakra-ui/react";

// Components
import Header from "../../../../../components/structure/Header/Header";
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "../../../../../components/common/inputs/InputTextArea";
import InteractiveTable from "./subcomponents/tables/InteractiveTable";
import FlexLayout from "../../../../../components/structure/Flex/Flex";

// Infra
import axios from "../../../../../infrastructure/http/axiosClient";

// Service
import createProtocolThree from "../../services/useCreateProtocolThree";

// Hooks
import { useNavigation } from "@features/shared/hooks/useNavigation";

// Styles
import { buttonBox, formControl } from "./styles";

export default function ProtocolPartThree() {
  const [analysis, setAnalysis] = useState("");
  const { id = "" } = useParams();
  const { toGo } = useNavigation();
  const url = `http://localhost:8080/systematic-study/${id}/protocol`;

  useEffect(() => {
    async function fetch() {
      const accessToken = localStorage.getItem("accessToken");
      let options = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      let response = await axios.get(url, options);
      setAnalysis(response.data.content.analysisAndSynthesisProcess);
    }

    fetch();
  }, []);

  async function handleData() {
    await createProtocolThree(analysis, id);
    toGo("/newReview/identification");
  }

  async function handleDataReturn() {
    await createProtocolThree(analysis, id);
    toGo(`/newReview/protocolpartTwo/${id}`);
  }

  function handleAnalysisAndSynthesis(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setAnalysis(e.target.value);
  }

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
            value={analysis}
            label="Analysis and Synthesis"
            placeholder="Enter your analysis"
            onChange={handleAnalysisAndSynthesis}
          />

          <InteractiveTable
            id={id}
            url={url}
            label={"Risk of Bias Questions"}
          />
        </FormControl>

        <Box sx={buttonBox}>
          <NavButton text="Back" event={handleDataReturn} />
          <NavButton text="Save" event={handleData} w={"fit-content"} />
        </Box>
      </Box>
    </FlexLayout>
  );
}
