// External Library
import { useEffect, useState } from "react";

// Constants
const MAX_ITENS_PER_PAGE = 30;
const MIN_ITENS_PER_PAGE = 10;

// Types
interface PaginationState {
  totalPages: number;
  initialSize: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  setSize?: React.Dispatch<React.SetStateAction<number>>;
}

export default function usePaginationState({
  totalPages,
  initialSize = 20,
  setPage,
  setSize,
}: PaginationState) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itensPerPage, setItensPerPage] = useState<number>(initialSize);

  const quantityOfPages = totalPages > 0 ? totalPages : 1;

  useEffect(() => {
    if (setPage) {
      setPage(currentPage);
    }
  }, [currentPage, setPage]);

  useEffect(() => {
    if (setSize) {
      setSize(itensPerPage);
    }
  }, [itensPerPage, setSize]);

  useEffect(() => {
    if (currentPage > quantityOfPages) {
      setCurrentPage(quantityOfPages);
    }
  }, [currentPage, quantityOfPages]);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev === quantityOfPages ? 1 : prev + 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev === 1 ? quantityOfPages : prev - 1));
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
    itensPerPage,
    quantityOfPages,
    setCurrentPage,
    handleNextPage,
    handlePrevPage,
    handleBackToInitial,
    handleGoToFinal,
    changeQuantityOfItens,
  };
}
