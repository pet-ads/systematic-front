// External library
import { Box } from "@chakra-ui/react";


// Types

import ChartTable from "../../tables/ChartTable";
import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";

interface TableProps {
  articles:  ArticleInterface [];
  columnsVisible: ColumnVisibility;
}

export const ChartFullTable: React.FC<TableProps> = ({
  articles,
  columnsVisible,
}) => {
  return (
    <Box w="100%" h="100%">
      <ChartTable columnsVisible={columnsVisible} articles={articles}  />
    </Box>
  );
};
