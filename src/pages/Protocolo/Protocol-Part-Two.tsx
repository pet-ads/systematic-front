import GridLayout from "../../components/ui/Grid/Grid";
import Header from "../../components/ui/Header/Header";
import NavButton from "../../components/Buttons/NavButton";
import { Progress, FormControl, Box } from "@chakra-ui/react";
import { btnBox, conteiner, flex } from "./styles/partTwooStyles";
import TextAreaInput from "../../components/Inputs/InputTextArea";
import AddTextTable from "../../components/AddDataFields/AddTextTable";
import AddSelectionTable from "../../components/AddDataFields/AddSelectionTable";

export default function ProtocolPartTwo2() {
  return (
    <GridLayout defaultOpen={0} navigationType="Accordion">
      <Header text="Protocol" />
      <Progress value={33} />
      <FormControl sx={conteiner}>
        <FormControl sx={flex}>
          <AddTextTable text="Keywords" placeholder="Enter keywords" />
        </FormControl>

        <AddSelectionTable
          options={["", "English", "Portuguese", "French", "Spanish", "German"]}
          placeholder={"Languages:"}
          typeField="select"
        />

        <AddTextTable text="Inclusion Criteria:" placeholder="Enter the criteria" />
        <AddTextTable text="Exclusion Criteria:" placeholder="Enter the criteria" />

        <AddSelectionTable
          options={["", "Google Scholar", "Scopus", "Scielo", "BDTD", "PubMed"]}
          placeholder={"Data bases"}
          typeField="select"
        />

        <TextAreaInput label="Research Strategy" placeholder="Enter research strategy" />
        <TextAreaInput label="Article Selection Process" placeholder="Enter selection process" />
        <TextAreaInput label="Data Acquisition" placeholder="Enter the data acquisition method" />
      </FormControl>

      <Box sx={btnBox}>
        <NavButton text="Next" path="/newRevision/protocolpartThree" w={"fit-content"} />
      </Box>
    </GridLayout>
  );
}
