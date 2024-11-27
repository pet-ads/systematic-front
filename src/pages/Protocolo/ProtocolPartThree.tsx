import Header from "../../components/ui/Header/Header";
import NavButton from "../../components/Buttons/NavButton";
import { Progress, FormControl, Box } from "@chakra-ui/react";
import { buttonBox, formControl } from "./styles/partThreeStyles";
import TextAreaInput from "../../components/Inputs/InputTextArea";
import InteractiveTable from "../../components/Tables/InteractiveTable";
import FlexLayout from "../../components/ui/Flex/Flex";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCreateProtocolThree from '../../hooks/reviews/useCreateProtocolThree';
import axios from "../../interceptor/interceptor";

export default function ProtocolPartThree() {
  const [analysis, setAnalysis] = useState('');
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const url = `/systematic-study/${id}/protocol`;

  useEffect(() => {
    async function fetch(){
      const accessToken = localStorage.getItem('accessToken');
      const options = {
        headers: { Authorization: `Bearer ${accessToken}` }
      }

      const response = await axios.get(url, options)
      setAnalysis(response.data.content.analysisAndSynthesisProcess);
    }

    fetch();
  }, [url])

  async function handleData() {
      await useCreateProtocolThree(analysis, id);
      navigate("/newRevision/identification");
  }

  async function handleDataReturn() {
    await useCreateProtocolThree(analysis, id);
    navigate(`/newRevision/protocolpartTwo/${id}`);
  }

  function handleAnalysisAndSynthesis(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAnalysis(e.target.value);
  }

  return (
    <FlexLayout defaultOpen={0} navigationType="Accordion">

      <Box w={"100%"} display={"flex"}
        flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>

        <Header text="Protocol" />
        <Progress value={100} w={"100%"} />

        <FormControl sx={formControl}>

          
          <InteractiveTable id={id} url={url} label={"Extraction Questions"}/>
          
          <TextAreaInput value={analysis} label="Analysis and Synthesis" placeholder="Enter your analysis" onChange={handleAnalysisAndSynthesis} />
          
          <InteractiveTable id={id} url={url} label={"Risk of Bias Questions"}/>

        </FormControl>

        <Box sx={buttonBox}>
          <NavButton text='Return' event={handleDataReturn}/>
          <NavButton text="Save" event={handleData} w={"fit-content"} />
        </Box>

      </Box>

    </FlexLayout>
  );
}
