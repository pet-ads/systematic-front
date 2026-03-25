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
  sortConfig: { key: keyof ArticleInterface; direction: "asc" | "desc" } | null;
  handleHeaderClick: (key: keyof ArticleInterface) => void;
}

export const FullTable: React.FC<TableProps> = ({
  articles,
  columnsVisible,
  onRowClick,
  pagination,
  sortConfig,
  handleHeaderClick,
}) => {
  return (
    <Box w="100%" h="100%">
      <ArticlesTable
        articles={articles}
        columnsVisible={columnsVisible}
        onRowClick={onRowClick}
        pagination={pagination}
        sortConfig={sortConfig}
        handleHeaderClick={handleHeaderClick}
      />
    </Box>
  );
};
