// External library
import { useContext } from "react";
import { Box, Flex } from "@chakra-ui/react";

// Components
import ButtonsForSelection from "../../common/buttons/ButtonsForSelection";

// Context
import StudyContext from "@features/review/shared/context/StudiesContext";

// Types
import type { PageLayout } from "../LayoutFactory";
import type ArticleInterface from "../../../types/ArticleInterface";
import type { StudyInterface } from "../../../types/IStudy";
import StudyDataFiel from "../../common/tables/StudyData";
import { SelectionArticles } from "@features/review/execution-selection/services/useFetchSelectionArticles";
import { KeyedMutator } from "swr";

interface StudySelectionAreaProps {
  articles: ArticleInterface[] | StudyInterface[];
  page: PageLayout;
  reloadArticles: KeyedMutator<SelectionArticles>;
}

export default function StudySelectionArea({
  articles,
  page,
  reloadArticles,
}: StudySelectionAreaProps) {
  const studiesContext = useContext(StudyContext);

  if (!studiesContext)
    throw new Error("Failed to get selection context on study Selection area");

  const { selectedArticleReview, setSelectedArticleReview } = studiesContext;

  if (!articles || articles.length === 0) return null;

  const typedArticles = articles.filter(
    (art): art is ArticleInterface => "studyReviewId" in art
  );

  const findSelectedArticle = typedArticles.findIndex(
    (art) => art.studyReviewId === selectedArticleReview
  );

  const studyIndex = findSelectedArticle >= 0 ? findSelectedArticle : 0;

  if (studyIndex == 0) {
    setSelectedArticleReview(typedArticles[studyIndex].studyReviewId);
  }

  return (
    <Flex
      direction="column"
      borderRadius="1rem"
      bg="white"
      w="100%"
      h="100%"
      p="1rem 1.5rem"
      alignItems="center"
      gap="1rem"
    >
      <Flex alignItems="center" justifyContent="center" w="100%" maxW="100%">
        <ButtonsForSelection
          page={page}
          articles={articles}
          articleIndex={studyIndex}
          setSelectedArticleReview={setSelectedArticleReview}
          reloadArticles={reloadArticles}
        />
      </Flex>
      <Box w="100%" h="80%">
        <StudyDataFiel
          studyData={articles?.[studyIndex] as StudyInterface}
          page={page}
        />
      </Box>
    </Flex>
  );
}
