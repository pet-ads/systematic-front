import { Box, FormControl, Input } from "@chakra-ui/react";
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
import SearchButton from "../../../../components/Buttons/SearchButton";
import { useState } from "react";

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
  //const { value: selectedValue, handleChange: handleSelectChange } = useInputState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>("")

  const [searchTitle, setSearchTitle] = useState<string>("")
  const [studiesDataFiltered, setStudiesDataFiltered] = useState(studiesData)


  const searchDataTitle = (name:string, dataBody) =>{
    setSearchTitle(name);
    const localSearch = dataBody.filter(check => check.title.toLowerCase().includes(name.toLowerCase()))
    if(localSearch){
      setStudiesDataFiltered(localSearch)
    }    
  }

  const selectionDataFIlter = (name:string)=>{
    if(name===""){
      setStudiesDataFiltered(studiesData)
      setSelectedValue(name)
    }
    else{
      const localSelection = studiesData.filter(check => check.extractionStatus === name.toUpperCase())
      setSelectedValue(name)
      console.log(localSelection)
      if(localSelection){
        setStudiesDataFiltered(localSelection)
    }
    }
    
  }

  if (!studiesData) return <>Studies data nor found</>

  return (
    <FlexLayout defaultOpen={1} navigationType="Accordion">
      <Header text="Extraction" />
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
            onSelect={(e)=>selectionDataFIlter(e.toString())}
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
          bodyData={studiesDataFiltered? studiesDataFiltered: studiesData} 
          filteredColumns={checkedValues} 
          tableType={"extraction"} 
          />
      </Box>
    </FlexLayout>
  );
}
