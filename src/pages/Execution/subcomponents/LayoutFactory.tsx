  import ArticleInterface from "../../../types/ArticleInterface";
  import SkeletonLoader from "../../../components/ui/Skeleton/Skeleton";
  import { ViewModel } from "../../../hooks/useLayoutPage";
  import NoDataMessage from "./NoDataMessage";
  import React from "react";
  import { SplitVertical } from "./Layouts/SplitVertical";
  import { FullTable } from "./Layouts/FullTable";
  import { SplitHorizontal } from "./Layouts/SplitHorizontal";
  import { FullArticle } from "./Layouts/FullArticle";
  import { ColumnVisibility } from "../../../hooks/tables/useVisibleColumns";

  export type PageLayout = "Selection" | "Extraction" | "Identification";

  interface LayoutFactoryProps {
    layout: ViewModel;
    articles: ArticleInterface[] | [];
    page: PageLayout;
    isLoading: boolean;
    visibleColumns: ColumnVisibility;
  }

  export default function LayoutFactory({
    layout,
    articles,
    page,
    isLoading,
    visibleColumns,
  }: LayoutFactoryProps) {
    const layoutMap: Record<ViewModel, React.ReactNode> = {
      table: (
        <FullTable
          articles={articles}
          page={page}
          visibleColumns={visibleColumns}
        />
      ),
      vertical: (
        <SplitVertical
          articles={articles}
          isInverted={false}
          page={page}
          visibleColumns={visibleColumns}
        />
      ),
      "vertical-invert": (
        <SplitVertical
          articles={articles}
          isInverted={true}
          page={page}
          visibleColumns={visibleColumns}
        />
      ),
      horizontal: (
        <SplitHorizontal
          articles={articles}
          isInverted={false}
          page={page}
          layout={layout}
          visibleColumns={visibleColumns}
        />
      ),
      "horizontal-invert": (
        <SplitHorizontal
          articles={articles}
          isInverted={true}
          page={page}
          layout={layout}
          visibleColumns={visibleColumns}
        />
      ),
      article: <FullArticle articles={articles} page={page} />,
    };

    return isLoading ? (
      <SkeletonLoader width="100%" height="100%" />
    ) : articles && articles.length > 0 ? (
      layoutMap[layout]
    ) : (
      <NoDataMessage />
    );
  }
