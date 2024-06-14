import { Box } from "@chakra-ui/react";
import useInputState from "../../../../hooks/useInputState";
import FlexLayout from "../../../../components/ui/Flex/Flex";
import Header from "../../../../components/ui/Header/Header";
import ComboBox from "../../../../components/Inputs/ComboBox";
import InputText from "../../../../components/Inputs/InputText";
import SelectInput from "../../../../components/Inputs/SelectInput";
import DynamicTable from "../../../../components/Tables/DynamicTable";
import useFetchTableData from "../../../../hooks/seachAppropriateStudy/useFetchStudyData";
import { conteiner, inputconteiner } from "../../styles/executionStyles";
import { StudyInterface } from "../../../../../public/interfaces/IStudy";
import { TableHeadersInterface } from "../../../../../public/interfaces/ITableHeaders";

export default function Extraction() {
  const studiesData: StudyInterface[] | undefined = useFetchTableData("/data/NewStudyData.json");
  const headerData: TableHeadersInterface = {
    title: "Title",
    authors: "Author",
    year: "Year",
    selectionStatus: "Status/Selection",
    extractionStatus: "Status/Extraction",
    readingPriority: "Reading Priority"
  }

  const { value: checkedValues, handleChange: handleCheckboxChange } = useInputState<string[]>([]);
  const { value: selectedValue, handleChange: handleSelectChange } = useInputState<string | null>(null);

  if (!studiesData) return <>Studies data nor found</>

  return (
    <FlexLayout defaultOpen={1} navigationType="Accordion">
      <Header text="Extraction" />
      <Box sx={conteiner}>
        <Box sx={inputconteiner}>
          <InputText type="search" placeholder="Insert article's name" nome="search" />
          <SelectInput
            names={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
            values={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
            onSelect={handleSelectChange}
            selectedValue={selectedValue}
            page={"protocol"}
          />
          <ComboBox
            options={Object.values(headerData)}
            handleCheckboxChange={handleCheckboxChange}
            selectedItems={[
              "title",
              "author",
              "year",
              "status/selection",
              "status/extraction",
              "reading priority",
              "score",
            ]}
            text={"filter options"}
          />
        </Box>
      </Box>

      <Box marginLeft={"3em"} marginRight={"3em"} w={"78vw"}>
        <DynamicTable 
          headerData={headerData} 
          bodyData={studiesData} 
          filteredColumns={checkedValues} 
          tableType={"extraction"} 
          selectedStatus={selectedValue}
          />
      </Box>
    </FlexLayout>
  );
}
