// External library
import { AnimatePresence, motion } from "framer-motion";
import { Flex } from "@chakra-ui/react";

// Components
import StudySelectionArea from "../../../structure/StudySelectionArea";
import ArticlesTable from "../../tables/ArticlesTable";

// Hooks
import ArticleInterface from "../../../../types/ArticleInterface";

// Hooks
import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";

// Animations
const verticalTransitionVariants = {
  initial: { opacity: 0, x: 5 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -5, transition: { duration: 0.5 } },
};

// Types
import type { PageLayout } from "../../../structure/LayoutFactory";
import { PaginationControls } from "@features/shared/types/pagination";
import { KeyedMutator } from "swr";
import { SelectionArticles } from "@features/review/execution-selection/services/useFetchSelectionArticles";
interface VerticalProps {
  isInverted: boolean;
  articles: ArticleInterface[];
  page: PageLayout;
  columnsVisible: ColumnVisibility;
  pagination: PaginationControls;
  reloadArticles: KeyedMutator<SelectionArticles>;
}

export const SplitVertical: React.FC<VerticalProps> = ({
  isInverted,
  articles,
  page,
  columnsVisible,
  pagination,
  reloadArticles,
}) => {
  return (
    <Flex
      w="100%"
      h="calc(100% - 1rem)"
      gap="1rem"
      justifyContent="space-between"
      pr=".5rem"
    >
      {isInverted ? (
        <AnimatePresence mode="wait">
          <motion.div
            key="top"
            variants={verticalTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ minWidth: "35%", maxHeight: "100%" }}
          >
            <StudySelectionArea
              articles={articles}
              page={page}
              reloadArticles={reloadArticles}
            />
          </motion.div>
          <motion.div
            key="bottom"
            variants={verticalTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ maxWidth: "65%", maxHeight: "100%" }}
          >
            <ArticlesTable
              articles={articles}
              columnsVisible={columnsVisible}
              pagination={pagination}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key="bottom"
            variants={verticalTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ maxWidth: "65%", maxHeight: "100%" }}
          >
            <ArticlesTable
              articles={articles}
              columnsVisible={columnsVisible}
              pagination={pagination}
            />
          </motion.div>
          <motion.div
            key="top"
            variants={verticalTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ minWidth: "35%", maxHeight: "100%" }}
          >
            <StudySelectionArea
              articles={articles}
              page={page}
              reloadArticles={reloadArticles}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </Flex>
  );
};
