// External library
import { useContext, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";

// Components
import ButtonsForSelection from "../../common/buttons/ButtonsForSelection";

// Context
import StudyContext from "@features/review/shared/context/StudiesContext";

// Infra
import Axios from "../../../../../../infrastructure/http/axiosClient";

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
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export default function StudySelectionArea({
  articles,
  page,
  reloadArticles,
  currentPage,
  totalPages,
  pageSize,
}: StudySelectionAreaProps) {
  const studiesContext = useContext(StudyContext);

  if (!studiesContext)
    throw new Error("Failed to get selection context on study Selection area");

  const { selectedArticleReview, setSelectedArticleReview } = studiesContext;

  const [navPage, setNavPage] = useState(currentPage);
  const [navArticles, setNavArticles] = useState<ArticleInterface[] | null>(null);

  const id = localStorage.getItem("systematicReviewId");

  const fetchPageSilently = async (targetPage: number): Promise<ArticleInterface[]> => {
    const response = await Axios.get<SelectionArticles>(
      `systematic-study/${id}/study-review/search`,
      { params: { page: targetPage, size: pageSize } }
    );
    return response.data.studyReviews.filter(
      (art): art is ArticleInterface => "studyReviewId" in art
    );
  };

  const onFetchNextPage = async (): Promise<ArticleInterface[]> => {
    const next = navPage + 1;
    const fetched = await fetchPageSilently(next);
    setNavPage(next);
    setNavArticles(fetched);
    return fetched;
  };

  const onFetchPrevPage = async (): Promise<ArticleInterface[]> => {
    const prev = navPage - 1;
    const fetched = await fetchPageSilently(prev);
    setNavPage(prev);
    setNavArticles(fetched);
    return fetched;
  };

  const activeArticles: ArticleInterface[] | StudyInterface[] =
    navArticles !== null ? navArticles : articles;

  if (!activeArticles || activeArticles.length === 0) return null;

  const typedArticles = activeArticles.filter(
    (art): art is ArticleInterface => "studyReviewId" in art
  );

  const findSelectedArticle = typedArticles.findIndex(
    (art) => art.studyReviewId === selectedArticleReview
  );

  const studyIndex = findSelectedArticle >= 0 ? findSelectedArticle : 0;

  if (studyIndex === 0 && typedArticles[0]) {
    setSelectedArticleReview(typedArticles[0].studyReviewId);
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
          articles={activeArticles}
          articleIndex={studyIndex}
          setSelectedArticleReview={setSelectedArticleReview}
          reloadArticles={reloadArticles}
          isLastPage={navPage >= totalPages - 1}
          isFirstPage={navPage <= 0}
          onFetchNextPage={onFetchNextPage}
          onFetchPrevPage={onFetchPrevPage}
        />
      </Flex>
      <Box w="100%" h="80%">
        <StudyDataFiel studyData={activeArticles?.[studyIndex] as StudyInterface} page={page} />
      </Box>
    </Flex>
  );
}
