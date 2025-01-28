import { Box, Flex } from "@chakra-ui/react";
import { LayoutModel } from "../Selection";
import ArticleInterface from "../../../../../public/interfaces/ArticleInterface";
import StudySelectionArea from "./StudySelectionArea";
import ArticlesTable from "../../../../components/Tables/ArticlesTable/ArticlesTable";
import ExtractionForm from "../../Extraction/subcomponents/forms/ExtractionForm/ExtractionForm";

interface PageLayout {
  type: "Selection" | "Extraction";
}

interface LayoutFactoryProps {
  layout: LayoutModel;
  articles: ArticleInterface[];
  filteredArticles: ArticleInterface[];
  page: PageLayout;
}

export default function LayoutFactory({
  layout,
  articles,
  filteredArticles,
  page,
}: LayoutFactoryProps) {
  switch (layout.orientation) {
    case "horizontal":
      return (
        <Flex w="100%" h="100%">
          <Box w="50%" h="100%">
            <ArticlesTable
              articles={
                filteredArticles.length > 0 ? filteredArticles : articles
              }
            />
          </Box>
          <Box w="100%" h="100%">
            <StudySelectionArea />
            {page.type === "Extraction" && <ExtractionForm />}
          </Box>
        </Flex>
      );

    case "vertical":
      return (
        <Flex flexDirection="column" w="100%" h="100%">
          <Box w="100%" h="50%">
            <ArticlesTable
              articles={
                filteredArticles.length > 0 ? filteredArticles : articles
              }
            />
          </Box>
          <Box w="100%" h="50%">
            <StudySelectionArea />
            {page.type === "Extraction" && <ExtractionForm />}
          </Box>
        </Flex>
      );
    default:
      return (
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <ArticlesTable
            articles={filteredArticles.length > 0 ? filteredArticles : articles}
          />
          <Box w="100%">
            <StudySelectionArea />
            {page.type === "Extraction" && <ExtractionForm />}
          </Box>
        </Flex>
      );
  }
}
