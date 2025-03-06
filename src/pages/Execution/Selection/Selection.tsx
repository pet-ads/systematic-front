import { useContext, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";

import useInputState from "../../../hooks/useInputState";

import Header from "../../../components/ui/Header/Header";
import FlexLayout from "../../../components/ui/Flex/Flex";
import InputText from "../../../components/Inputs/InputText";
import SelectInput from "../../../components/Inputs/SelectInput";
import LayoutFactory from "../subcomponents/LayoutFactory";
import ButtonsLayout from "../subcomponents/LayoutButtons";

import { AppProvider } from "../../../components/Context/AppContext";
import StudySelectionContext, {
  StudySelectionProvider,
} from "../../../components/Context/StudiesSelectionContext";

import { handleSearchAndFilter } from "../../../utils/handleSearchAndFilter";

import { inputconteiner } from "../styles/executionStyles";

import ArticleInterface from "../../../../public/interfaces/ArticleInterface";
import { PageLayout } from "../subcomponents/LayoutFactory";
// import { flex } from "../../NovaRevisao/styles/finalizationStyles";

// Unused imports
// import ComboBox from "../../../components/Inputs/ComboBox";
// import DynamicTable from "../../../components/Tables/DynamicTable";
// import useFetchTableData from "../../../hooks/seachAppropriateStudy/useFetchStudyData";
// import { StudyInterface } from "../../../../public/interfaces/IStudy";
// import { TableHeadersInterface } from "../../../../public/interfaces/ITableHeaders";
// import { KeywordInterface } from "../../../../public/interfaces/KeywordInterface";
// import { tableTypeEnum } from "../../../../public/enums/tableTypeEnum";
// import useGetAllReviewArticles from "../../../hooks/useGetAllReviewArticles";
// import ArticlesTable from "../../../components/Tables/ArticlesTable/ArticlesTable";

// export interface LayoutModel {
//   orientation: "article" | "table" | "vertical";
// }

export type ViewModel = "table" | "vertical" | "article";

export default function Selection() {
  const { value: selectedStatus, handleChange: handleSelectChange } =
    useInputState<string | null>(null);
  const [searchString, setSearchString] = useState<string>("");
  const selectionContext = useContext(StudySelectionContext);
  const [layout, setLayout] = useState<ViewModel>("vertical");

  if (!selectionContext) throw new Error("Failed to get the selection context");
  const articles: ArticleInterface[] = selectionContext.articles.filter(
    (art): art is ArticleInterface => "studyReviewId" in art
  );

  const page: PageLayout = { type: "Selection" };

  const filteredArticles = handleSearchAndFilter(
    searchString,
    selectedStatus,
    articles,
    page
  );

  const handleArticleLayoutChange = () => setLayout("article");
  const handleTableLayoutChange = () => setLayout("table");
  const handleVerticalLayoutChange = () => setLayout("vertical");

  return (
    <AppProvider>
      <StudySelectionProvider>
        <FlexLayout defaultOpen={1} navigationType="Accordion">
          <Box w="98%" m="1rem" h="fit-content">
            <Box
              w="100%"
              h="100%"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              // overflowY="auto"
            >
              <Flex
                w="100%"
                h="2.5rem"
                justifyContent="space-between"
                alignItems="center"
                mb="2rem"
              >
                <Header text="Selection" />
                <ButtonsLayout
                  layout={layout}
                  handleArticleLayoutChange={handleArticleLayoutChange}
                  handleTableLayoutChange={handleTableLayoutChange}
                  handleVerticalLayoutChange={handleVerticalLayoutChange}
                />
              </Flex>
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
                  <SelectInput
                    names={[
                      "INCLUDED",
                      "DUPLICATED",
                      "EXCLUDED",
                      "UNCLASSIFIED",
                    ]}
                    values={[
                      "INCLUDED",
                      "DUPLICATED",
                      "EXCLUDED",
                      "UNCLASSIFIED",
                    ]}
                    onSelect={(value) => handleSelectChange(value)}
                    selectedValue={selectedStatus}
                    page={"selection"}
                    placeholder="Selection status"
                  />
                </Box>
              </Box>
              <Box w="100%" h="82.5vh">
                <LayoutFactory
                  page={{ type: "Selection" }}
                  layout={layout}
                  articles={filteredArticles}
                />
              </Box>
            </Box>
          </Box>
        </FlexLayout>
      </StudySelectionProvider>
    </AppProvider>
  );
}
