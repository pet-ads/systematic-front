// External library
import { AnimatePresence, motion } from "framer-motion";
import { Flex } from "@chakra-ui/react";

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

interface HorizontalProps {
  isInverted: boolean;
  articles: ArticleInterface[];
  page: PageLayout;
  layout: ViewModel;
  columnsVisible: ColumnVisibility;
}

export const SplitHorizontal: React.FC<HorizontalProps> = ({
  isInverted,
  articles,
  page,
  layout,
  columnsVisible,
}) => {
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
              layout={layout}
              columnsVisible={columnsVisible}
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
              layout={layout}
              columnsVisible={columnsVisible}
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
