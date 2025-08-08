import { useState } from "react";
import ArticleInterface from "../types/ArticleInterface";

const MAX_ITENS_PER_PAGE = 30;
const MIN_ITENS_PER_PAGE = 10;

export default function usePagination(articles: ArticleInterface[]) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itensPerPage, setItensPerPage] = useState<number>(15);

  const quantityOfElements = articles.length;
  const quantityOfPages = Math.ceil(quantityOfElements / itensPerPage);

  const startPosition = (currentPage - 1) * itensPerPage;
  const finalPosition = startPosition + itensPerPage;

  const paginatedArticles: ArticleInterface[] = articles.slice(
    startPosition,
    finalPosition
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev % quantityOfPages) + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(
      (prev) => ((prev - 2 + quantityOfPages) % quantityOfPages) + 1
    );
  };

  const changeQuantityOfItens = (newQuantity: number) => {
    const quantity = Number(newQuantity);
    if (quantity < MIN_ITENS_PER_PAGE || quantity > MAX_ITENS_PER_PAGE) return;

    setItensPerPage(quantity);
    setCurrentPage(1);
  };

  return {
    currentPage,
    setCurrentPage,
    quantityOfPages,
    paginatedArticles,
    handleNextPage,
    handlePrevPage,
    changeQuantityOfItens,
  };
}
