// External library
import { AnimatePresence, motion } from "framer-motion";
import { Flex, Box } from "@chakra-ui/react";

// Components
import ArticlesTable from "../../tables/ArticlesTable";
import StudySelectionArea from "../../../structure/StudySelectionArea";

// Hooks
import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";

// Animations
const horizontalTransitionVariants = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -5, transition: { duration: 0.5 } },
};

// Types
import type { PageLayout } from "../../../structure/LayoutFactory";
import type { ViewModel } from "../../../../hooks/useLayoutPage";
import type ArticleInterface from "../../../../types/ArticleInterface";
import { PaginationControls } from "@features/shared/types/pagination";
import { SelectionArticles } from "@features/review/execution-selection/services/useFetchSelectionArticles";
import { KeyedMutator } from "swr";

interface HorizontalProps {
  isInverted: boolean;
  articles: ArticleInterface[];
  page: PageLayout;
  layout: ViewModel;
  columnsVisible: ColumnVisibility;
  pagination: PaginationControls;
  reloadArticles: KeyedMutator<SelectionArticles>;
}

export const SplitHorizontal: React.FC<HorizontalProps> = ({
  isInverted,
  articles,
  page,
  layout,
  columnsVisible,
  pagination,
  reloadArticles,
}) => {
  return (
    <Flex
      w="100%"
      h="calc(100% - 1rem)"
      flexDirection="column"
      gap="1rem"
      justifyContent="space-between"
      overflow="hidden"
    >
      {isInverted ? (
        <AnimatePresence mode="wait">
          <motion.div
            key="top"
            variants={horizontalTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ 
              width: "100%", 
              height: "48%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box w="100%" h="100%" overflowY="auto" overflowX="hidden">
              <StudySelectionArea
                articles={articles}
                page={page}
                reloadArticles={reloadArticles}
              />
            </Box>
          </motion.div>
          <motion.div
            key="bottom"
            variants={horizontalTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ 
              width: "100%", 
              height: "48%", 
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box w="100%" h="100%" overflowY="auto" overflowX="hidden">
              <ArticlesTable
                articles={articles}
                layout={layout}
                columnsVisible={columnsVisible}
                pagination={pagination}
              />
            </Box>
          </motion.div>
        </AnimatePresence>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key="bottom"
            variants={horizontalTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ 
              width: "100%", 
              height: "48%", 
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box w="100%" h="100%" overflowY="auto" overflowX="hidden">
              <ArticlesTable
                articles={articles}
                layout={layout}
                columnsVisible={columnsVisible}
                pagination={pagination}
              />
            </Box>
          </motion.div>
          <motion.div
            key="top"
            variants={horizontalTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ 
              width: "100%", 
              height: "48%", 
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box w="100%" h="100%" overflowY="auto" overflowX="hidden">
              <StudySelectionArea
                articles={articles}
                page={page}
                reloadArticles={reloadArticles}
              />
            </Box>
          </motion.div>
        </AnimatePresence>
      )}
    </Flex>
  );
};
