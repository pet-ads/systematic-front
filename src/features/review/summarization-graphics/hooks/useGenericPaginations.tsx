import { useState, useMemo } from "react";

const MIN_ITENS_PER_PAGE = 10;
const MAX_ITENS_PER_PAGE = 30;

export default function useGenericPagination<T>(data: T[] = []) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itensPerPage, setItensPerPage] = useState(MIN_ITENS_PER_PAGE);

  const quantityOfPages = Math.max(
    1,
    Math.ceil(data.length / itensPerPage)
  );

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itensPerPage;
    const end = start + itensPerPage;
    return data.slice(start, end);
  }, [data, currentPage, itensPerPage]);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, quantityOfPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleBackToInitial = () => setCurrentPage(1);

  const handleGoToFinal = () => setCurrentPage(quantityOfPages);

  const changeQuantityOfItens = (value: number) => {
    if (value < MIN_ITENS_PER_PAGE || value > MAX_ITENS_PER_PAGE) return;

    setItensPerPage(value);
    setCurrentPage(1);
  };

  return {
    currentPage,
    itensPerPage,
    quantityOfPages,
    paginatedItems,
    handleNextPage,
    handlePrevPage,
    handleBackToInitial,
    handleGoToFinal,
    changeQuantityOfItens,
  };
}
