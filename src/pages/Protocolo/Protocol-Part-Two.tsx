import React from 'react';
import axios from '../../interceptor/interceptor';
import Header from "../../components/ui/Header/Header";
import NavButton from "../../components/Buttons/NavButton";
import { Progress, FormControl, Box } from "@chakra-ui/react";
import { btnBox, conteiner, flex } from "./styles/partTwooStyles";
import TextAreaInput from "../../components/Inputs/InputTextArea";
import AddTextTable from "../../components/AddDataFields/AddTextTable";
import AddSelectionTable from "../../components/AddDataFields/AddSelectionTable";
import FlexLayout from "../../components/ui/Flex/Flex";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useCreateProtocolTwo from "../../hooks/revisions/useCreateProtocolTwo";
import { useNavigate } from "react-router-dom";

export default function ProtocolPartTwo2() {
  const [researchStrategy, setResearchStrategy] = useState<string>('');
  const [selectProcess, setSelectProcess] = useState<string>('');
  const [dataAcquisition, setDataAcquisition] = useState<string>('');
  const { id = '' } = useParams();

  const navigate = useNavigate();
  const url = `http://localhost:8080/systematic-study/${id}/protocol`;

  useEffect(() => {
    async function fetchValues(){
      const url = `http://localhost:8080/systematic-study/${id}/protocol`;
      let response = await axios.get(url, {withCredentials: true});

      setSelectProcess(response.data.content.selectionProcess);
      setResearchStrategy(response.data.content.searchMethod);
      setDataAcquisition(response.data.content.sourcesSelectionCriteria);
    }

    fetchValues();
  }, [])

  async function handleData(){
    await  useCreateProtocolTwo(researchStrategy, selectProcess, dataAcquisition, id);
    navigate(`/newRevision/protocolpartThree/${id}`);
  }

  async function handleDataReturn(){
    await  useCreateProtocolTwo(researchStrategy, selectProcess, dataAcquisition, id);
    navigate(`/newRevision/protocol/${id}`);
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

  return (
    <FlexLayout defaultOpen={0} navigationType="Accordion">
      <Box w={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
        <Header text="Protocol" />
        <Progress value={66} w={"100%"} color={"black"} />
        <FormControl sx={conteiner}>
          <FormControl sx={flex}>
            <AddTextTable url={url} id={id} text="Keywords" placeholder="Enter the keywords related to your review"/>
          </FormControl>
          <AddSelectionTable
            label="Languages"
            type="studiesLanguages"
            url={url}
            options={["ENGLISH", "PORTUGUESE", "FRENCH", "SPANISH", "GERMAN"]}
            placeholder={"Select language"}
            typeField="select"
          />
          <AddTextTable id={id} text="Inclusion criteria" placeholder="Enter the criteria" url={url}/>        
          <AddTextTable id={id} text="Exclusion criteria" placeholder="Enter the criteria" url={url}/>
          <AddSelectionTable
            label="Databases"
            type="databases" 
            url={url}
            options={["Google Scholar", "Scopus", "Scielo", "BDTD", "PubMed"]}
            placeholder={"Select Data Base"}
            typeField="select"
          />

          <TextAreaInput value={researchStrategy} onChange={handleResearchStrategy} label="Research Strategy" placeholder="Enter research strategy" />
          <TextAreaInput value={selectProcess} onChange={handleSelectProcess} label="Article Selection Process" placeholder="Enter selection process" />
          <TextAreaInput value={dataAcquisition} onChange={handleDataAcquisition}  label="Data Acquisition" placeholder="Enter the data acquisition method" />

        </FormControl>
        <Box sx={btnBox}>
          <NavButton event={handleDataReturn} text='Return'/>
          <NavButton event={handleData} text="Next" />
        </Box>
      </Box>
    </FlexLayout>
  );
}
