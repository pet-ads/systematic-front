import { Box } from "@chakra-ui/react";
import ArticleInterface from "../../../../types/ArticleInterface";
import { PageLayout } from "../../../structure/LayoutFactory";
import StudySelectionArea from "../../../structure/StudySelectionArea";
import { SelectionArticles } from "@features/review/execution-selection/services/useFetchSelectionArticles";
import { KeyedMutator } from "swr";

import { PaginationControls } from "@features/shared/types/pagination";

interface TableProps {
  articles: ArticleInterface[];
  page: PageLayout;
  reloadArticles: KeyedMutator<SelectionArticles>;
  pagination: PaginationControls;
  onTablePageChange: (page: number) => void;
  extraParams?: Record<string, any>;
}

export const FullArticle: React.FC<TableProps> = ({
  articles,
  page,
  reloadArticles,
  pagination,
  onTablePageChange,
  extraParams = {},
}) => {
  return (
    <Box w="100%" h="calc(100% - 1rem)">
      <StudySelectionArea
        articles={articles}
        page={page}
        reloadArticles={reloadArticles}
        currentPage={pagination.currentPage - 1}
        totalPages={pagination.quantityOfPages}
        pageSize={pagination.itensPerPage}
        onTablePageChange={onTablePageChange}
        extraParams={extraParams}
      />
    </Box>
  );
};
