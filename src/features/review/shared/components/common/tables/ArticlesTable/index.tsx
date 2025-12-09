// External library
import { useMemo, useState } from "react";

import type ArticleInterface from "@features/review/shared/types/ArticleInterface";

// Components
import Expanded from "./subcomponents/Expanded";

// Types
import type { ViewModel } from "@features/review/shared/hooks/useLayoutPage";
import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";
import { PaginationControls } from "@features/shared/types/pagination";

interface Props {
  articles: ArticleInterface[];
  layout?: ViewModel;
  columnsVisible: ColumnVisibility;
  onRowClick?: (article: ArticleInterface) => void;
  pagination: PaginationControls;
  checkbox?: boolean;
}

export default function ArticlesTable({
  articles,
  layout,
  columnsVisible,
  onRowClick,
  pagination,
  checkbox
}: Props) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ArticleInterface;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedArticles = useMemo(() => {
    if (!sortConfig) return articles;
    const sorted = [...articles].sort((primary, secund) => {
      const primaryValue = primary[sortConfig?.key];
      const nextValue = secund[sortConfig?.key];

      if (primaryValue > nextValue)
        return sortConfig.direction === "asc" ? -1 : 1;
      if (nextValue > primaryValue)
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [articles, sortConfig]);

  const handleHeaderClick = (key: keyof ArticleInterface) => {
    setSortConfig((prevConfig) => {
      if (prevConfig?.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <Expanded
      articles={sortedArticles}
      handleHeaderClick={handleHeaderClick}
      sortConfig={sortConfig}
      layout={layout}
      columnsVisible={columnsVisible}
      onRowClick={onRowClick}
      pagination={pagination}
      checkbox={checkbox}
    />
  );
}
