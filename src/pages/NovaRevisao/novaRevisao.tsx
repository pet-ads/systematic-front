import { Box, FormControl } from "@chakra-ui/react";
import Header from "../../components/ui/Header/Header";
import InputText from "../../components/Inputs/InputText";
import NavButton from "../../components/Buttons/NavButton";
import InputTextArea from "../../components/Inputs/InputTextArea";
import ResearcherFilter from "../UserArea/subcomponents/ResearcherFilter";
import FlexLayout from "../../components/ui/Flex/Flex";
import { useState } from "react";
import useCreateRevision from "../../hooks/revisions/useCreateRevision";

export default function NovaRevisao() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>([]);

  async function handleData(){
    useCreateRevision(title, description, collaborators);
  }

  function handleTitle(e: React.ChangeEvent<HTMLInputElement>){
    setTitle(e.target.value);
  }

  function handleDescription(e: React.ChangeEvent<HTMLTextAreaElement>){
    setDescription(e.target.value);
  }

  function handleCollaborators(e: React.ChangeEvent<HTMLTextAreaElement>){
    let collabs = e.target.value.split(' ');
    setCollaborators(collabs);
  }

  return (
    <FlexLayout navigationType="Accordion" defaultOpen={0}>
      <Header text="New Systematic Review" />

      <FormControl mt={"20px"} display={"flex"} gap={5} flexDir={"column"} w={"70%"} alignItems={"center"} ml={"10em"}>
        <InputText placeholder="Enter review title" type="text" nome="text" onChange={handleTitle}/>

        <InputTextArea label="Description:" placeholder="Enter review description" onChange={handleDescription}></InputTextArea>

        <InputTextArea label="Collaborators:" placeholder="Enter review collaborators" onChange={handleCollaborators}></InputTextArea>

        <Box ml={"71%"}>
          <NavButton event={handleData} path={"/newRevision/protocol"} text="Create new Review" />
        </Box>
      </FormControl>
    </FlexLayout>
  );
}
