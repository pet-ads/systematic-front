import Header from "../../components/ui/Header/Header";
import NavButton from "../../components/Buttons/NavButton";
import { Progress, FormControl, Box } from "@chakra-ui/react";
import { btnBox, conteiner, flex } from "./styles/partTwooStyles";
import TextAreaInput from "../../components/Inputs/InputTextArea";
import AddTextTable from "../../components/AddDataFields/AddTextTable";
import AddCriteriaTable from "../../components/AddDataFields/AddCriteriaTable";
import AddSelectionTable from "../../components/AddDataFields/AddSelectionTable";
import InteractiveTable from "../../components/Tables/InteractiveTable";
import { Row } from "../../hooks/useInteractiveTable";
import FlexLayout from "../../components/ui/Flex/Flex";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useCreateProtocolTwo from "../../hooks/revisions/useCreateProtocolTwo";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtocolPartTwo2() {
  const [InclusionCriteria, setInclusionCriteria] = useState<{ description: string; type: "INCLUSION" | "EXCLUSION"; }[]>([]);
  const [exclusionCriteria, setExclusionCriteria] = useState<{ description: string; type: "INCLUSION" | "EXCLUSION"; }[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [databases, setDatabases] = useState<string[]>([]);
  const [researchStrategy, setResearchStrategy] = useState<string>('');
  const [selectProcess, setSelectProcess] = useState<string>('');
  const [dataAcquisition, setDataAcquisition] = useState<string>('');
  const [analysis, setAnalysis] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const { id = '' } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    console.log("protocolPartTwo");
  })

  async function handleData(){
    await  useCreateProtocolTwo(keywords, languages, databases, researchStrategy, selectProcess, dataAcquisition, InclusionCriteria, exclusionCriteria, questions, analysis, id);
    navigate(`/newRevision/selection`, {state: {keywords, languages, databases, researchStrategy, selectProcess, dataAcquisition, InclusionCriteria, exclusionCriteria}});
  }

  async function alert(){
    window.alert("Todos os campos do protocolo precisam estar preenchidos");
  }

  function handleResearchStrategy(e: React.ChangeEvent<HTMLTextAreaElement>){
    setResearchStrategy(e.target.value);
  }

  function handleSelectProcess(e: React.ChangeEvent<HTMLTextAreaElement>){
    setSelectProcess(e.target.value);
  }

  function handleDataAcquisition(e: React.ChangeEvent<HTMLTextAreaElement>){
    setDataAcquisition(e.target.value);
  }

  function handleSave(data: Row[]) {
    const newQuestions: string[] = [];
    data.forEach((item) => {
      newQuestions.push(item.question);
    });
    setQuestions(newQuestions);
  }

  function handleAnalysisAndSynthesis(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAnalysis(e.target.value);
  }

  return (
    <FlexLayout defaultOpen={0} navigationType="Accordion">

      <Box w={"100%"} display={"flex"}
      flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>

        <Header text="Protocol" />
        <Progress value={33} w={"100%"}/>

        <FormControl sx={conteiner}>
          <FormControl sx={flex}>
            <AddTextTable text="Keywords" placeholder="Enter keywords"/>
          </FormControl>

          <AddSelectionTable
            label="Languages"
            onUpdate={setLanguages}
            options={["choose an option", "ENGLISH", "PORTUGUESE", "FRENCH", "SPANISH", "GERMAN"]}
            placeholder={"Languages:"}
            typeField="select"
          />

          <AddCriteriaTable text="Inclusion Criteria:" placeholder="Enter the criteria" onUpdate={setInclusionCriteria}/>
          <AddCriteriaTable text="Exclusion Criteria:" placeholder="Enter the criteria" onUpdate={setExclusionCriteria}/>

          <AddSelectionTable
            label="Databases"
            onUpdate={setDatabases}
            options={["", "Google Scholar", "Scopus", "Scielo", "BDTD", "PubMed"]}
            placeholder={"Data bases"}
            typeField="select"
          />

          <TextAreaInput onChange={handleResearchStrategy} label="Research Strategy" placeholder="Enter research strategy" />
          <TextAreaInput onChange={handleSelectProcess} label="Article Selection Process" placeholder="Enter selection process" />
          <TextAreaInput onChange={handleDataAcquisition}  label="Data Acquisition" placeholder="Enter the data acquisition method" />
    
          <InteractiveTable onSave={handleSave} />
          <TextAreaInput label="Analysis and Synthesis" placeholder="Enter your analysis" onChange={handleAnalysisAndSynthesis} />

        </FormControl>

        <Box sx={btnBox}>
          {questions.length == 0 && keywords.length == 0 
          && InclusionCriteria.length == 0 && exclusionCriteria.length == 0
          && languages.length == 0 && databases.length == 0
          && researchStrategy == "" && selectProcess == "" && dataAcquisition == ""
          && analysis == "" && questions.length == 0? <NavButton event={alert} text="Create new Review" /> :
          <NavButton event={handleData} text="Save" />
          }
        </Box>

      </Box>
      
    </FlexLayout>
  );
}
