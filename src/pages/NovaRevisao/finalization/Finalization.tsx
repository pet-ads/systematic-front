import { Box, Flex, FormControl, Textarea } from "@chakra-ui/react";
import useInputState from "../../../hooks/useInputState";
import Header from "../../../components/ui/Header/Header";
import FlexLayout from "../../../components/ui/Flex/Flex";
import ComboBox from "../../../components/Inputs/ComboBox";
import InputText from "../../../components/Inputs/InputText";
import SelectInput from "../../../components/Inputs/SelectInput";
import StudySelectionArea from "../../Execution/SubPages/Selection/subcomponents/StudySelectionArea";
import DynamicTable from "../../../components/Tables/DynamicTable";
import useFetchTableData from "../../../hooks/seachAppropriateStudy/useFetchStudyData";
import { conteiner, inputconteiner } from "../../Execution/styles/executionStyles";
import { AppProvider } from "../../../components/Context/AppContext";
import { StudyInterface } from "../../../../public/interfaces/IStudy";
import { TableHeadersInterface } from "../../../../public/interfaces/ITableHeaders";
import { KeywordInterface } from "../../../../public/interfaces/KeywordInterface";
import EventButton from "../../../components/Buttons/EventButton";
import TextAreaInput from "../../../components/Inputs/InputTextArea";

export default function Selection<U extends StudyInterface | KeywordInterface>() {
  const studiesData: U[] | undefined = useFetchTableData("/data/NewStudyData.json");
  const headerData: TableHeadersInterface = {
    title: "Title",
    authors: "Author",
    year: "Year",
    selectionStatus: "Status/Selection",
    extractionStatus: "Status/Extraction",
    readingPriority: "Reading Priority"
}
  const { value: selectedValue, handleChange: handleSelectChange } = useInputState<string | null>(null);
  const { value: checkedValues, handleChange: handleCheckboxChange } = useInputState<string[]>([]);

  if(!studiesData) return <>Studies data nor found</>

  return (
    <AppProvider>
      <FlexLayout defaultOpen={2} navigationType="Accordion">
        <Header text="Finalization" />

        <Box sx={conteiner}>
          <Box sx={inputconteiner}>
            <InputText type="search" placeholder="Insert article's name" nome="search" />
            <SelectInput
              names={["", "criteria 1", "criteria 2", "criteria 3", "criteria 4"]}
              values={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
              onSelect={handleSelectChange}
              selectedValue={selectedValue}
              page={"selection"}
              placeholder="Inclusion criteria"
            />
            <SelectInput
              names={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
              values={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
              onSelect={handleSelectChange}
              selectedValue={selectedValue}
              page={"selection"}
              placeholder="Classification"
            />
          </Box>
        </Box>

        <Box ml={"3em"} mr={"3em"} w={"78vw"}>
          <DynamicTable
            headerData={headerData}
            bodyData={studiesData}
            filteredColumns={checkedValues}
            tableType={"selection"}
            selectedStatus={selectedValue}
          />
        </Box>
        <Flex w="90%" flexDirection="column" alignItems="end" mt="2rem" pl="3rem">
        <FormControl>
          <Textarea bgColor={"#C9D9E5"} w={{ base: "60%", md: "80%", lg: "93%" }} h="8rem"/>
        </FormControl>
        <Box w="5rem" mr="8rem" mt="1rem">
          <EventButton text="Export"/>
        </Box>
        </Flex>
      </FlexLayout>
    </AppProvider>
  );
}
