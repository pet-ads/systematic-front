import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import Header from "../../../../../components/structure/Header/Header";

import useGetSessionStudies from "../../services/useGetSessionStudies";
import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import FlexLayout from "../../../../../components/structure/Flex/Flex";
import { Box, Button } from "@chakra-ui/react";
import ArticlesTable from "@features/review/shared/components/common/tables/ArticlesTable";
import useVisibiltyColumns from "@features/review/shared/hooks/useVisibilityColumns";
import ColumnVisibilityMenu from "@features/review/shared/components/common/menu/ColumnVisibilityMenu";
import usePaginationState from "@features/shared/hooks/usePaginationState";

export default function IdentificationSession() {
  const [fetchedTotalPages, setFetchedTotalPages] = useState<number>(1);
  const { session = "" } = useParams();

  const [searchParams] = useSearchParams();

  const totalItems = Number(searchParams.get("totalItems")) || 0;

  const { columnsVisible, toggleColumnVisibility } = useVisibiltyColumns({
    page: "Identification",
  });

  const {
    currentPage,
    itensPerPage,
    setCurrentPage,
    handleNextPage,
    handlePrevPage,
    handleBackToInitial,
    handleGoToFinal,
    changeQuantityOfItens,
  } = usePaginationState({ totalPages: fetchedTotalPages, initialSize: 20 });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof ArticleInterface;
    direction: "asc" | "desc";
  } | null>(null);

  const handleHeaderClick = (key: keyof ArticleInterface) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    setCurrentPage(1);
  };

  const { articles, totalPages } = useGetSessionStudies(
    session,
    currentPage - 1,
    itensPerPage,
    sortConfig,
  );

  if (totalPages && totalPages !== fetchedTotalPages) {
    setFetchedTotalPages(totalPages);
  }

  return (
    <FlexLayout navigationType="Accordion">
      <Header text="Search Sessions" />
      <Box
        justifyContent="center"
        alignItems="start"
        w="calc(100% - 2rem)"
        h="90vh"
      >
        <Box
          display="flex"
          gap="1rem"
          justifyContent="space-between"
          alignContent="center"
          width="100%"
          marginBottom="1.5rem"
          px="1rem"
        >
          <Button
            as={Link}
            to={`/review/execution/identification`}
            backgroundColor={"#263C56"}
            color={"#EBF0F3"}
            boxShadow="sm"
            _hover={{ bg: "#2A4A6D", boxShadow: "md" }}
          >
            Back
          </Button>
          <ColumnVisibilityMenu
            columnsVisible={columnsVisible}
            toggleColumnVisibility={toggleColumnVisibility}
          />
        </Box>
        <ArticlesTable
          articles={articles}
          columnsVisible={columnsVisible}
          sortConfig={sortConfig}
          handleHeaderClick={handleHeaderClick}
          pagination={{
            currentPage,
            itensPerPage,
            quantityOfPages: totalPages,
            totalElements: totalItems,
            handleNextPage,
            handlePrevPage,
            handleBackToInitial,
            handleGoToFinal,
            changeQuantityOfItens,
          }}
          checkbox={false}
        />
      </Box>
    </FlexLayout>
  );
}
