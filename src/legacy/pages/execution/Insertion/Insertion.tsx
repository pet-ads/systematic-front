import { Box } from "@chakra-ui/react";
import useInputState from "../../../../hooks/useInputState";
import Header from "../../../../components/ui/Header/Header";
import FlexLayout from "../../../../components/ui/Flex/Flex";
// import ComboBox from "../../../components/Inputs/ComboBox";
import InputText from "../../../../components/Inputs/InputText";
import NavButton from "../../../../components/Buttons/NavButton";
import SelectInput from "../../../../components/Inputs/SelectInput";
import EventButton from "../../../../components/Buttons/EventButton";
import DynamicTable from "../../../components/commons/toolkit/tables/execution/DynamicTable/DynamicTable";
import useFetchTableData from "../../../hooks/execution/useFetchStudyData";
import {
  btnconteiner,
  conteiner,
  inputconteiner,
} from "../../../../pages/Execution/styles/executionStyles";

import { NoStudiesData } from "../../../../components/NotFound/NoStudiesData";
import { tableTypeEnum } from "../../../../types/enums/tableTypeEnum";
import { TableHeadersInterface } from "../../../../types/ITableHeaders";

export default function Insertion() {
  const bodyData = useFetchTableData("/data/tableData.json");

  const headerData: TableHeadersInterface = {
    title: "Title",
    authors: "Author",
    year: "Year",
    selectionStatus: "Status/Selection",
    extractionStatus: "Status/Extraction",
    readingPriority: "Reading Priority",
  };

  const { value: selectedValue, handleChange: handleSelectChange } =
    useInputState<string | null>(null);
  const { value: checkedValues } = useInputState<string[]>([
    "title",
    "authors",
    "year",
    "selectionStatus",
    "extractionStatus",
    "readingPriority",
  ]);

  // const handleCheckboxChange = (option: string, isChecked: boolean) => {
  //   if (isChecked) {
  //     setCheckedValues([...checkedValues, option]);
  //   } else {
  //     setCheckedValues(checkedValues.filter((item) => item !== option));
  //   }
  // };

  if (!bodyData) return <NoStudiesData />;

  return (
    <FlexLayout defaultOpen={1} navigationType="Accordion">
      <Header text="Insertion" />
      <Box sx={conteiner} marginLeft={"1em"}>
        <Box sx={inputconteiner}>
          <InputText
            type="search"
            placeholder="Insert article's name"
            nome="search"
          />
          <SelectInput
            names={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
            values={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
            onSelect={handleSelectChange}
            selectedValue={selectedValue}
            page={"insertion"}
          />
          {/* <ComboBox
            options={Object.keys(headerData)}
            onOptionchange={handleCheckboxChange}
            selectedItems={checkedValues}
            text={"filter options"}
            isDisabled={!headerData}
            page={"Selection"}
          /> */}
        </Box>
      </Box>

      <Box marginLeft={"3em"} marginRight={"3em"} w={"78vw"}>
        <DynamicTable
          headerData={headerData}
          bodyData={bodyData}
          filteredColumns={checkedValues}
          tableType={tableTypeEnum.SELECTION}
        />
        <Box sx={btnconteiner}>
          <NavButton
            text={"Back"}
            path={"/newReview/identification"}
            w={"200px"}
          />
          <EventButton
            event={() => {
              console.log("Adicionando novo paper!");
            }}
            text={"Add Paper"}
            w={"200px"}
          />
        </Box>
      </Box>
    </FlexLayout>
  );
}
