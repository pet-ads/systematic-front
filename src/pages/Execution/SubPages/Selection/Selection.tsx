import { Box, Button, FormControl, Input } from "@chakra-ui/react";
import useInputState from "../../../../hooks/useInputState";
import Header from "../../../../components/ui/Header/Header";
import FlexLayout from "../../../../components/ui/Flex/Flex";
import ComboBox from "../../../../components/Inputs/ComboBox";
//import InputText from "../../../../components/Inputs/InputText";
import SelectInput from "../../../../components/Inputs/SelectInput";
import StudySelectionArea from "./subcomponents/StudySelectionArea";
import DynamicTable from "../../../../components/Tables/DynamicTable";
import useFetchTableData from "../../../../hooks/seachAppropriateStudy/useFetchStudyData";
import { conteiner, inputconteiner } from "../../styles/executionStyles";
import { AppProvider } from "../../../../components/Context/AppContext";
import { StudyInterface } from "../../../../../public/interfaces/IStudy";
import { TableHeadersInterface } from "../../../../../public/interfaces/ITableHeaders";
import { KeywordInterface } from "../../../../../public/interfaces/KeywordInterface";
import { useState } from "react";
import SearchButton from "../../../../components/Buttons/SearchButton";


export const conteinerSearch = {
  display: "flex",
  maxW: "60vw",
};

export const inputconteinerSearch = {
  display: "flex",
  flexDir: "row",
  gap: ".3rem",
  w: "100%",
};

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
  //const { value: selectedValue, handleChange: handleSelectChange } = useInputState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>("")
  const { value: checkedValues, handleChange: handleCheckboxChange } = useInputState<string[]>([]);

  const [searchTitle, setSearchTitle] = useState<string>("")
  const [studiesDataFiltered, setStudiesDataFiltered] = useState(studiesData)

  const searchDataTitle = (name:string, dataBody:U[] | undefined) =>{
    setSearchTitle(name);
    const localSearch = dataBody.filter(check => check.title.toLowerCase().includes(name.toLowerCase()))
    if(localSearch){
      setStudiesDataFiltered(localSearch)
    }    
  }

  const selectionDataFIlter = (name:string, dataBody: U[] | undefined)=>{
    if(name===""){
      setStudiesDataFiltered(studiesData)
      setSelectedValue(name)
    }
    else{
      const localSelection = dataBody.filter(check => check.selectionStatus === name.toUpperCase())
      setSelectedValue(name)
      console.log(localSelection)
      if(localSelection){
        setStudiesDataFiltered(localSelection)
    }
    }
    
  }

  if(!studiesData) return <>Studies data nor found</>

  return (
    <AppProvider>
      <FlexLayout defaultOpen={1} navigationType="Accordion">
        <Header text="Selection" />

        <Box sx={conteiner}>
          <Box sx={inputconteiner}>
            <FormControl sx={conteinerSearch}>
              <FormControl sx={inputconteinerSearch}>
              <Input placeholder="Insert article's name" value={searchTitle} onChange={(e)=>searchDataTitle(e.target.value, studiesData)}
                w="250px"
                bgColor={"#C9D9E5"}
                borderRadius={"3px"}
                _placeholder={{ opacity: 1, color: "gray.500" }}
                focusBorderColor="#526D82"
                />
                <SearchButton/>
              </FormControl>
            </FormControl>
            
            <SelectInput
              names={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
              values={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
              onSelect={(e)=>selectionDataFIlter(e.toString(), studiesData)}
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
            bodyData={studiesDataFiltered? studiesDataFiltered: studiesData}
            filteredColumns={checkedValues}
            tableType={"selection"}
          />
          <StudySelectionArea />
        </Box>
      </FlexLayout>
    </AppProvider>
  );
}
