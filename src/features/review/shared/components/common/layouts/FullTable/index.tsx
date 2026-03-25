// External library
import { Box } from "@chakra-ui/react";

// Components
import ArticlesTable from "../../tables/ArticlesTable";

// Hooks
import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";

// Types
import type ArticleInterface from "../../../../types/ArticleInterface";
import { PaginationControls } from "@features/shared/types/pagination";
interface TableProps {
  articles: ArticleInterface[];
  columnsVisible: ColumnVisibility;
  onRowClick?: (article: ArticleInterface) => void;
  pagination: PaginationControls;
}

export const FullTable: React.FC<TableProps> = ({
  articles,
  columnsVisible,
  onRowClick,
  pagination,
}) => {
  return (
    <Box w="100%" h="100%">
      <ArticlesTable
        articles={articles}
        columnsVisible={columnsVisible}
        onRowClick={onRowClick}
        pagination={pagination}
      />
    </Box>
  );
};
