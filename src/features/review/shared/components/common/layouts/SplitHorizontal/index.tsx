// External library
import { AnimatePresence, motion } from "framer-motion";
import { Flex, Box } from "@chakra-ui/react";

// Components
import ArticlesTable from "../../tables/ArticlesTable";
import StudySelectionArea from "../../../structure/StudySelectionArea";

// Types
import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";
import type { PageLayout } from "../../../structure/LayoutFactory";
import type { ViewModel } from "../../../../hooks/useLayoutPage";
import type ArticleInterface from "../../../../types/ArticleInterface";
import { PaginationControls } from "@features/shared/types/pagination";
import { SelectionArticles } from "@features/review/execution-selection/services/useFetchSelectionArticles";
import { KeyedMutator } from "swr";

const horizontalTransitionVariants = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -5, transition: { duration: 0.5 } },
};

interface HorizontalProps {
  isInverted: boolean;
  articles: ArticleInterface[];
  page: PageLayout;
  layout: ViewModel;
  columnsVisible: ColumnVisibility;
  pagination: PaginationControls;
  sortConfig: { key: keyof ArticleInterface; direction: "asc" | "desc" } | null;
  handleHeaderClick: (key: keyof ArticleInterface) => void;
  reloadArticles: KeyedMutator<SelectionArticles>;
  onTablePageChange: (page: number) => void;
  extraParams?: Record<string, any>;
}

export const SplitHorizontal: React.FC<HorizontalProps> = ({
  isInverted,
  articles,
  page,
  layout,
  columnsVisible,
  pagination,
  sortConfig,
  handleHeaderClick,
  reloadArticles,
  onTablePageChange,
  extraParams = {},
}) => {
  const motionStyle = {
    width: "100%",
    height: "48%",
    display: "flex",
    flexDirection: "column" as const,
  };

  const selectionArea = (
    <Box w="100%" h="100%" overflowY="auto" overflowX="hidden">
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

  const table = (
    <Box w="100%" h="100%" overflowY="auto" overflowX="hidden">
      <ArticlesTable
        articles={articles}
        layout={layout}
        columnsVisible={columnsVisible}
        pagination={pagination}
        sortConfig={sortConfig}
        handleHeaderClick={handleHeaderClick}
      />
    </Box>
  );

  return (
    <Flex
      w="100%"
      h="calc(100% - 1rem)"
      flexDirection="column"
      gap="1rem"
      justifyContent="space-between"
      overflow="hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="first"
          variants={horizontalTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={motionStyle}
        >
          {isInverted ? selectionArea : table}
        </motion.div>
        <motion.div
          key="second"
          variants={horizontalTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={motionStyle}
        >
          {isInverted ? table : selectionArea}
        </motion.div>
      </AnimatePresence>
    </Flex>
  );
};
