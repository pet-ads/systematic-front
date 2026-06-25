// External library
import { AnimatePresence, motion } from "framer-motion";
import { Flex } from "@chakra-ui/react";

// Components
import StudySelectionArea from "../../../structure/StudySelectionArea";
import ArticlesTable from "../../tables/ArticlesTable";

// Types
import ArticleInterface from "../../../../types/ArticleInterface";
import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";
import type { PageLayout } from "../../../structure/LayoutFactory";
import { PaginationControls } from "@features/shared/types/pagination";
import { KeyedMutator } from "swr";
import { SelectionArticles } from "@features/review/execution-selection/services/useFetchSelectionArticles";

// Hooks
import useWindowWidth from "@features/shared/hooks/useWindowWidth";

const verticalTransitionVariants = {
  initial: { opacity: 0, x: 5 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -5, transition: { duration: 0.5 } },
};

interface VerticalProps {
  isInverted: boolean;
  articles: ArticleInterface[];
  page: PageLayout;
  columnsVisible: ColumnVisibility;
  pagination: PaginationControls;
  sortConfig: {
    key: keyof ArticleInterface;
    direction: "asc" | "desc";
  } | null;
  handleHeaderClick: (key: keyof ArticleInterface) => void;
  reloadArticles: KeyedMutator<SelectionArticles>;
  onTablePageChange: (page: number) => void;
  extraParams?: Record<string, any>;
  handleChangeLayout?: (layout: any) => void;
}

export const SplitVertical: React.FC<VerticalProps> = ({
  isInverted,
  articles,
  page,
  columnsVisible,
  pagination,
  sortConfig,
  handleHeaderClick,
  reloadArticles,
  onTablePageChange,
  extraParams = {},
  handleChangeLayout,
}) => {
  const window = useWindowWidth();
  let minWidth: string = "";
  let maxWidth: string = "";
  if(window > 1750) {
    maxWidth = "65%";
    minWidth = "35%";
  } else if(window > 1550) {
    maxWidth = "60%";
    minWidth = "40%";
  } else if(window > 1400) {
    maxWidth = "55%";
    minWidth = "45%";
  } else {
    maxWidth = "50%";
    minWidth = "50%";
  }

  const selectionArea = (
    <StudySelectionArea
      articles={articles}
      page={page}
      reloadArticles={reloadArticles}
      currentPage={pagination.currentPage - 1}
      totalPages={pagination.quantityOfPages}
      pageSize={pagination.itensPerPage}
      onTablePageChange={onTablePageChange}
      extraParams={extraParams}
      handleChangeLayout={handleChangeLayout}
      isVertical={true}
    />
  );

  const table = (
    <ArticlesTable
      articles={articles}
      columnsVisible={columnsVisible}
      pagination={pagination}
      sortConfig={sortConfig}
      handleHeaderClick={handleHeaderClick}
      isSplited={true}
      isVertical={true}
    />
  );

  return (
    <Flex
      w="100%"
      h="100%"
      gap="1rem"
      justifyContent="space-between"
      pr=".5rem"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="first"
          variants={verticalTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={
            isInverted
              ? { minWidth: minWidth, maxHeight: "100%" }
              : { maxWidth: maxWidth, maxHeight: "100%" }
          }
        >
          {isInverted ? selectionArea : table}
        </motion.div>
        <motion.div
          key="second"
          variants={verticalTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={
            isInverted
              ? { maxWidth: maxWidth, maxHeight: "100%" }
              : { minWidth: minWidth, maxHeight: "100%" }
          }
        >
          {isInverted ? table : selectionArea}
        </motion.div>
      </AnimatePresence>
    </Flex>
  );
};