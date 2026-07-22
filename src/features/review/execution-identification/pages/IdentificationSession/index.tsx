import { useState, useContext, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "../../../../../components/structure/Header/Header";

import useGetSessionStudies from "../../services/useGetSessionStudies";
import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import FlexLayout from "../../../../../components/structure/Flex/Flex";
import { Box, Button, Flex } from "@chakra-ui/react";
import ArticlesTable from "@features/review/shared/components/common/tables/ArticlesTable";
import useVisibiltyColumns from "@features/review/shared/hooks/useVisibilityColumns";
import ColumnVisibilityMenu from "@features/review/shared/components/common/menu/ColumnVisibilityMenu";
import usePaginationState from "@features/shared/hooks/usePaginationState";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";
import AppContext from "@features/shared/context/ApplicationContext";

export default function IdentificationSession() {
  const window = useWindowWidth();
  const context = useContext(AppContext);
  if(!context) return null;
  const { sidebarState, setSidebarState } = context;
  useEffect(() => {
    if(window < 1000 && sidebarState === "open") setSidebarState("collapsed");
  }, []);
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
  const { t } = useTranslation("review/execution-identification");
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
      <Header text={t("searchSessions.header")} />
      <Box w="100%" px="1rem" py=".75rem" h="fit-content">
        <Flex
          w="100%"
          h="2.5rem"
          justifyContent="space-between"
          alignItems="center"
          mb="1rem"
        >
          <Button
            as={Link}
            to={`/review/execution/identification`}
            backgroundColor={"#263C56"}
            color={"#EBF0F3"}
            boxShadow="sm"
            _hover={{ bg: "#2A4A6D", boxShadow: "md" }}
            >
            {t("searchSessions.back")}
          </Button>
          <ColumnVisibilityMenu
            columnsVisible={columnsVisible}
            toggleColumnVisibility={toggleColumnVisibility}
            />
        </Flex>
      </Box>
      <Box
        w="calc(100% - 1.5rem)"
        h="calc(100% - 6rem)"
        m="0 auto"
      >
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
