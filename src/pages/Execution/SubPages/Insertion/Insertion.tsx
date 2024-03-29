import { Box } from "@chakra-ui/react";
import useInputState from "../../../../hooks/useInputState";
import GridLayout from "../../../../components/ui/Grid/Grid";
import Header from "../../../../components/ui/Header/Header";
import ComboBox from "../../../../components/Inputs/ComboBox";
import InputText from "../../../../components/Inputs/InputText";
import NavButton from "../../../../components/Buttons/NavButton";
import SelectInput from "../../../../components/Inputs/SelectInput";
import EventButton from "../../../../components/Buttons/EventButton";
import DynamicTable from "../../../../components/Tables/DynamicTable";
import useFetchTableData from "../../../../hooks/fetch/useFetchTableData";
import { btnconteiner, conteiner, inputconteiner } from "../../styles/executionStyles";

export default function Insertion() {
  const { headerData, bodyData } = useFetchTableData("/data/tableData.json");
  const { value: selectedValue, handleChange: handleSelectChange } = useInputState<string | null>(null);
  const { value: checkedValues, handleChange: handleCheckboxChange } = useInputState<string[]>([]);
  return (
    <GridLayout defaultOpen={1} navigationType="Accordion">
      <Header text="Insertion" />
      <Box sx={conteiner}>
        <Box sx={inputconteiner}>
          <InputText type="search" placeholder="Insert article's name" nome="search" />
          <SelectInput
            names={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
            values={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
            onSelect={handleSelectChange}
            selectedValue={selectedValue}
          />
          <ComboBox
            options={headerData}
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
      <DynamicTable headerData={headerData} bodyData={bodyData} filteredColumns={checkedValues} />
      <Box sx={btnconteiner}>
        <NavButton text={"Back"} path={"/newRevision/identification"} w={"200px"} />
        <EventButton
          event={function (): void {
            console.log("Adicionando novo paper!");
          }}
          text={"Add Paper"}
          w={"200px"}
        />
      </Box>
    </GridLayout>
  );
}
