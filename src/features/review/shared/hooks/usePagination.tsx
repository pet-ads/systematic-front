import { useState, useMemo } from "react";
import ArticleInterface from "../types/ArticleInterface";

const MAX_ITENS_PER_PAGE = 30;
const MIN_ITENS_PER_PAGE = 10;

export default function usePagination(articles: ArticleInterface[]) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itensPerPage, setItensPerPage] = useState<number>(20);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof ArticleInterface;
    direction: "asc" | "desc";
  } | null>(null);

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
    setCurrentPage(1);
  };

  const sortedArticles = useMemo(() => {
    if (!sortConfig) return articles;
    return [...articles].sort((primary, secund) => {
      const primaryValue = primary[sortConfig.key];
      const nextValue = secund[sortConfig.key];

      if (primaryValue > nextValue)
        return sortConfig.direction === "asc" ? 1 : -1;
      if (nextValue > primaryValue)
        return sortConfig.direction === "asc" ? -1 : 1;
      return 0;
    });
  }, [articles, sortConfig]);

  const quantityOfElements = sortedArticles.length;
  const quantityOfPages = Math.ceil(quantityOfElements / itensPerPage);

  const startPosition = (currentPage - 1) * itensPerPage;
  const finalPosition = startPosition + itensPerPage;

  const paginatedArticles: ArticleInterface[] = sortedArticles.slice(
    startPosition,
    finalPosition,
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev % quantityOfPages) + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(
      (prev) => ((prev - 2 + quantityOfPages) % quantityOfPages) + 1,
    );
  };

  const handleBackToInitial = () => {
    setCurrentPage(1);
  };

  const handleGoToFinal = () => {
    setCurrentPage(quantityOfPages);
  };

  const changeQuantityOfItens = (newQuantity: number) => {
    const quantity = Number(newQuantity);
    if (quantity < MIN_ITENS_PER_PAGE || quantity > MAX_ITENS_PER_PAGE) return;

    setItensPerPage(quantity);
    setCurrentPage(1);
  };

  return {
    currentPage,
    quantityOfPages,
    paginatedArticles,
    sortConfig,
    handleNextPage,
    handlePrevPage,
    handleBackToInitial,
    handleGoToFinal,
    changeQuantityOfItens,
    handleHeaderClick,
  };
}
