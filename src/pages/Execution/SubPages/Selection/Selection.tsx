import { Box } from "@chakra-ui/react";
import useInputState from "../../../../hooks/useInputState";
import Header from "../../../../components/ui/Header/Header";
import FlexLayout from "../../../../components/ui/Flex/Flex";
import ComboBox from "../../../../components/Inputs/ComboBox";
import InputText from "../../../../components/Inputs/InputText";
import SelectInput from "../../../../components/Inputs/SelectInput";
import StudySelectionArea from "./subcomponents/StudySelectionArea";
import DynamicTable from "../../../../components/Tables/DynamicTable";
import useFetchTableData from "../../../../hooks/seachAppropriateStudy/useFetchStudyData";
import { conteiner, inputconteiner } from "../../styles/executionStyles";
import { AppProvider } from "../../../../components/Context/AppContext";
import { StudyInterface } from "../../../../../public/interfaces/IStudy";
import { TableHeadersInterface } from "../../../../../public/interfaces/ITableHeaders";
import { KeywordInterface } from "../../../../../public/interfaces/KeywordInterface";

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
      <FlexLayout defaultOpen={1} navigationType="Accordion">
        <Header text="Selection" />

        <Box sx={conteiner}>
          <Box sx={inputconteiner}>
            <InputText type="search" placeholder="Insert article's name" nome="search" />
            <SelectInput
              names={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
              values={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
              onSelect={handleSelectChange}
              selectedValue={selectedValue}
              page={"selection"}
            />
            <ComboBox
              text="filter options"
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
          <StudySelectionArea />
        </Box>
      </FlexLayout>
    </AppProvider>
  );
}
