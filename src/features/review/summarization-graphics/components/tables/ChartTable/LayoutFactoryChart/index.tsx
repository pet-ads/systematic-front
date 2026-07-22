

// Components
import SkeletonLoader from "@components/feedback/Skeleton";

import { ChartFullTable } from "../../../layout/ChartFullTable";

// Types

import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import NoDataMessage from "@features/review/shared/components/structure/NoDataMessage";
import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";

interface LayoutFactoryProps {
  articles: ArticleInterface[] ;
  isLoading: boolean;
  columnsVisible: ColumnVisibility;
}

export default function LayoutFactoryChart({
  articles,
  isLoading,
  columnsVisible,
}: LayoutFactoryProps) {
  return isLoading ? (
    <SkeletonLoader width="100%" height="100%" />
  ) : articles && articles.length > 0 ? (
    <ChartFullTable columnsVisible={columnsVisible} articles={articles} />
  ) : (
    <NoDataMessage isReport={true} />
  );
}
