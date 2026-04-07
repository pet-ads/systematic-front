// External library
import { useContext, useState, useEffect } from "react";
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
  onTablePageChange: (page: number) => void;
  extraParams?: Record<string, any>;
}

export default function StudySelectionArea({
  articles,
  page,
  reloadArticles,
  currentPage,
  totalPages,
  pageSize,
  onTablePageChange,
  extraParams = {},
}: StudySelectionAreaProps) {
  const studiesContext = useContext(StudyContext);

  if (!studiesContext)
    throw new Error("Failed to get selection context on study Selection area");

  const { selectedArticleReview, setSelectedArticleReview } = studiesContext;

  const [navPage, setNavPage] = useState(currentPage);
  const [navArticles, setNavArticles] = useState<ArticleInterface[] | null>(null);

  const id = localStorage.getItem("systematicReviewId");

  const firstArticleId = (articles[0] as ArticleInterface)?.studyReviewId ?? null;

  useEffect(() => {
    setNavPage(currentPage);
    setNavArticles(null);
  }, [currentPage]);

  useEffect(() => {
    setNavPage(currentPage);
    setNavArticles(null);
  }, [firstArticleId]);

  const fetchPageSilently = async (targetPage: number): Promise<ArticleInterface[]> => {
    try {
      const response = await Axios.get<SelectionArticles>(
        `systematic-study/${id}/study-review/search`,
        {
          params: {
            page: targetPage,
            size: pageSize,
            ...extraParams,
          },
        }
      );
      return response.data.studyReviews.filter(
        (art): art is ArticleInterface => "studyReviewId" in art
      );
    } catch (error) {
      console.error(`Failed to fetch page ${targetPage}:`, error);
      return [];
    }
  };

  const onFetchNextPage = async (): Promise<ArticleInterface[]> => {
    const next = navPage + 1;
    const fetched = await fetchPageSilently(next);
    if (fetched.length > 0) {
      setNavPage(next);
      setNavArticles(fetched);
      onTablePageChange(next);
    }
    return fetched;
  };

  const onFetchPrevPage = async (): Promise<ArticleInterface[]> => {
    const prev = navPage - 1;
    const fetched = await fetchPageSilently(prev);
    if (fetched.length > 0) {
      setNavPage(prev);
      setNavArticles(fetched);
      onTablePageChange(prev);
    }
    return fetched;
  };

  const onWrapToLast = async (): Promise<ArticleInterface[]> => {
    const lastPage = totalPages - 1;
    const fetched = await fetchPageSilently(lastPage);
    if (fetched.length > 0) {
      setNavPage(lastPage);
      setNavArticles(fetched);
      onTablePageChange(lastPage);
    }
    return fetched;
  };

  const onWrapToFirst = (): ArticleInterface[] => {
    setNavPage(currentPage);
    setNavArticles(null);
    onTablePageChange(0);
    return articles.filter(
      (art): art is ArticleInterface => "studyReviewId" in art
    );
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

  useEffect(() => {
    if (studyIndex === 0 && typedArticles[0]) {
      setSelectedArticleReview(typedArticles[0].studyReviewId);
    }
  }, [typedArticles[0]?.studyReviewId]);

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
          onWrapToLast={onWrapToLast}
          onWrapToFirst={onWrapToFirst}
        />
      </Flex>
      <Box w="100%" h="80%">
        <StudyDataFiel
          studyData={activeArticles?.[studyIndex] as StudyInterface}
          page={page}
        />
      </Box>
    </Flex>
  );
}
