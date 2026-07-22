// ChartTable.tsx
import { useMemo, useState } from "react";
import type ArticleInterface from "@features/review/shared/types/ArticleInterface";
import type { ViewModel } from "@features/review/shared/hooks/useLayoutPage";
import ChartExpanded, { AllKeys } from "./ChartExpanded";
import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";

interface Props {
  articles: ArticleInterface[];
  layout?: ViewModel;
  columnsVisible: ColumnVisibility;
}

export default function ChartTable({ articles, layout, columnsVisible }: Props) {
  const [sortConfig, setSortConfig] = useState<{
    key: AllKeys;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedArticles = useMemo(() => {
    if (!sortConfig) return articles;

    return [...articles].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortConfig.key === "ic") {
        aValue = a.criteria?.join(", ") ?? "";
        bValue = b.criteria?.join(", ") ?? "";
      } else if (sortConfig.key === "searchSources") {
        aValue = a.searchSources?.join(", ") ?? "";
        bValue = b.searchSources?.join(", ") ?? "";
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key ];
      }

      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      return 0;
    });
  }, [articles, sortConfig]);

  const handleHeaderClick = (key: AllKeys) => {
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
    <ChartExpanded
      articles={sortedArticles}
      handleHeaderClick={handleHeaderClick}
      sortConfig={sortConfig}
      layout={layout}
      columnsVisible={columnsVisible}
    />
  );
}
