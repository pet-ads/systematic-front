import { Box } from "@chakra-ui/react";
import ArticleInterface from "../../../../types/ArticleInterface";
import ArticlesTable from "../../../../components/Tables/ArticlesTable/ArticlesTable";
import { PageLayout } from "../LayoutFactory";
import { ColumnVisibility } from "../../../../hooks/tables/useVisibleColumns";


interface TableProps {
  articles: ArticleInterface[];
  page: PageLayout;
  visibleColumns: ColumnVisibility;
}

export const FullTable: React.FC<TableProps> = ({
  articles,
  page,
  visibleColumns,
}) => {
  return (
    <Box w="100%" h="100%">
      <ArticlesTable
        articles={articles}
        page={page}
        visibleColumns={visibleColumns}
      />
    </Box>
  );
};
