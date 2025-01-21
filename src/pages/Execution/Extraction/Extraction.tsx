import { Box, Flex } from "@chakra-ui/react";
import useInputState from "../../../hooks/useInputState";
import FlexLayout from "../../../components/ui/Flex/Flex";
import Header from "../../../components/ui/Header/Header";
// import ComboBox from "../../../components/Inputs/ComboBox";
import InputText from "../../../components/Inputs/InputText";
import SelectInput from "../../../components/Inputs/SelectInput";
// import DynamicTable from "../../../components/Tables/DynamicTable";
import useFetchTableData from "../../../hooks/seachAppropriateStudy/useFetchStudyData";
import { conteiner, inputconteiner } from "../styles/executionStyles";
import { StudyInterface } from "../../../../public/interfaces/IStudy";
// import { TableHeadersInterface } from "../../../../public/interfaces/ITableHeaders";
import { useContext, useState } from "react";
// import { tableTypeEnum } from "../../../../public/enums/tableTypeEnum";
import { NoStudiesData } from "../../../components/NotFound/NoStudiesData";
import { AppProvider } from "../../../components/Context/AppContext";
import StudySelectionContext, {
  StudySelectionProvider,
} from "../../../components/Context/StudiesSelectionContext";
import { handleSearchAndFilter } from "../../../utils/handleSearchAndFilter";
import ArticleInterface from "../../../../public/interfaces/ArticleInterface";
import ArticlesTable from "../../../components/Tables/ArticlesTable/ArticlesTable";
import ExtractionForm from "./subcomponents/forms/ExtractionForm/ExtractionForm";
// import StudySelectionArea from "../Selection/subcomponents/StudySelectionArea";

export default function Extraction() {
  const studiesData: StudyInterface[] | undefined = useFetchTableData(
    "/data/NewStudyData.json"
  );
  //   const headerData: TableHeadersInterface = {
  //     title: "Title",
  //     authors: "Author",
  //     year: "Year",
  //     selectionStatus: "Status/Selection",
  //     extractionStatus: "Status/Extraction",
  //     readingPriority: "Reading Priority"
  // }

  // const { value: checkedValues, handleChange: handleCheckboxChange } = useInputState<string[]>([]);
  // const { value: selectedValue, handleChange: handleSelectChange } = useInputState<string | null>(null);
  const { value: selectedStatus, handleChange: handleSelectChange } =
    useInputState<string | null>(null);
  const [searchString, setSearchString] = useState<string>("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const selectionContext = useContext(StudySelectionContext);

  if (!selectionContext) throw new Error("Failed to get the selection context");
  let articles: ArticleInterface[] = [];
  articles = selectionContext.articles.filter((art) => art.selectionStatus === "INCLUDED");

  console.log("artigos filtrados em extraction: ", articles);

  const filteredArticles = handleSearchAndFilter(
    searchString,
    selectedStatus,
    selectedColumns,
    articles
  );


  if (!studiesData) return <NoStudiesData />;

  return (
    // <FlexLayout defaultOpen={1} navigationType="Accordion">
    //   <Header text="Extraction" />
    //   <Box sx={conteiner}>
    //     <Box sx={inputconteiner}>
    //       <InputText type="search" placeholder="Insert article's name" nome="search" setSearchString={setSearchString}/>
    //       <SelectInput
    //         names={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
    //         values={["", "Accepted", "Duplicated", "Rejected", "Unclassified"]}
    //         onSelect={handleSelectChange}
    //         selectedValue={selectedValue}
    //         page={"protocol"}
    //       />
    //       <ComboBox
    //         options={Object.values(headerData)}
    //         handleCheckboxChange={handleCheckboxChange}
    //         selectedItems={[
    //           "title",
    //           "author",
    //           "year",
    //           "status/selection",
    //           "status/extraction",
    //           "reading priority",
    //           "score",
    //         ]}
    //         text={"filter options"}
    //       />
    //     </Box>
    //   </Box>

    //   <Box marginLeft={"3em"} marginRight={"3em"} w={"78vw"}>
    //     <DynamicTable headerData={headerData} bodyData={studiesData} filteredColumns={checkedValues}
    //     tableType={tableTypeEnum.EXTRACTION} searchString={""} selectedStatus={null} />
    //   </Box>
    // </FlexLayout>
    <AppProvider>
      <StudySelectionProvider>
        <FlexLayout defaultOpen={1} navigationType="Accordion">
          <Header text="Extraction" />
          <Box overflowY="auto" h="90%">
            <Box w="100%">
              <Box sx={conteiner}>
                <Box sx={inputconteiner}>
                  <InputText
                    type="search"
                    placeholder="Insert article atribute"
                    nome="search"
                    onChange={(e) => setSearchString(e.target.value)}
                    value={searchString}
                  />
                  <Box
                    display="flex"
                    gap="1rem"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {/* <SelectInput
                      names={[
                        "INCLUDED",
                        "DUPLICATED",
                        "REJECTED",
                        "UNCLASSIFIED",
                      ]}
                      values={[
                        "INCLUDED",
                        "DUPLICATED",
                        "REJECTED",
                        "UNCLASSIFIED",
                      ]}
                      onSelect={(value) => handleSelectChange(value)}
                      selectedValue={selectedStatus}
                      page={"selection"}
                      placeholder="Selection status"
                    /> */}
                  </Box>
                </Box>
              </Box>
              <Flex
                justifyContent="center"
                alignItems={"center"}
                flexDirection={"column"}
                w="97%"
                gap="1rem"
              >
                <ArticlesTable
                  articles={
                    filteredArticles.length > 0 ? filteredArticles : articles
                  }
                />
                {articles.length > 0 && <ExtractionForm />}
              </Flex>
            </Box>
          </Box>
        </FlexLayout>
      </StudySelectionProvider>
    </AppProvider>
  );
}
