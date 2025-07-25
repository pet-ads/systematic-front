import { Flex } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import StudySelectionArea from "../StudySelectionArea";
import ArticleInterface from "../../../../types/ArticleInterface";
import { PageLayout } from "../LayoutFactory";
import ArticlesTable from "../../../../components/Tables/ArticlesTable/ArticlesTable";
import { ViewModel } from "../../../../hooks/useLayoutPage";
import { ColumnVisibility } from "../../../../hooks/tables/useVisibleColumns";

interface HorizontalProps {
  isInverted: boolean;
  articles: ArticleInterface[];
  page: PageLayout;
  layout: ViewModel;
  visibleColumns: ColumnVisibility;
}

export const SplitHorizontal: React.FC<HorizontalProps> = ({
  isInverted,
  articles,
  page,
  layout,
  visibleColumns,
}) => {
  const horizontalTransitionVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -5, transition: { duration: 0.5 } },
  };

  return (
    <Flex
      w="100%"
      h="100%"
      flexDirection="column"
      gap=".5rem"
      justifyContent="space-between"
    >
      {isInverted ? (
        <AnimatePresence mode="wait">
          <motion.div
            key="top"
            variants={horizontalTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ maxWidth: "100%", maxHeight: "55%" }}
          >
            <StudySelectionArea articles={articles} page={page} />
          </motion.div>
          <motion.div
            key="bottom"
            variants={horizontalTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ArticlesTable
              articles={articles}
              page={page}
              layout={layout}
              visibleColumns={visibleColumns}
            />
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
          >
            <ArticlesTable
              articles={articles}
              page={page}
              layout={layout}
              visibleColumns={visibleColumns}
            />
          </motion.div>
          <motion.div
            key="top"
            variants={horizontalTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ maxWidth: "100%", maxHeight: "55%" }}
          >
            <StudySelectionArea articles={articles} page={page} />
          </motion.div>
        </AnimatePresence>
      )}
    </Flex>
  );
};
