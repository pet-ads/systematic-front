// External library
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
  sortConfig: { key: keyof ArticleInterface; direction: "asc" | "desc" } | null;
  handleHeaderClick: (key: keyof ArticleInterface) => void;
}

export default function ArticlesTable({
  articles,
  layout,
  columnsVisible,
  onRowClick,
  pagination,
  checkbox,
  sortConfig,
  handleHeaderClick,
}: Props) {
  return (
    <Expanded
      articles={articles}
      sortConfig={sortConfig}
      handleHeaderClick={handleHeaderClick}
      layout={layout}
      columnsVisible={columnsVisible}
      onRowClick={onRowClick}
      pagination={pagination}
      checkbox={checkbox}
    />
  );
}
