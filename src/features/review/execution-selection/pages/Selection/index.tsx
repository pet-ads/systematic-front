// External library
import { useContext, useMemo, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

// Context
import StudySelectionContext from "@features/review/shared/context/StudiesContext";

// Hooks
import useInputState from "@features/review/shared/hooks/useInputState";
import useLayoutPage from "../../../shared/hooks/useLayoutPage";
import useVisibiltyColumns from "@features/review/shared/hooks/useVisibilityColumns";
import useFetchSelectionArticles from "../../services/useFetchSelectionArticles";
import usePaginationState from "@features/shared/hooks/usePaginationState";

// Components
import Header from "../../../../../components/structure/Header/Header";
import FlexLayout from "../../../../../components/structure/Flex/Flex";
import InputText from "../../../../../components/common/inputs/InputText";
import LayoutFactory from "../../../shared/components/structure/LayoutFactory";
import SelectLayout from "../../../shared/components/structure/LayoutButton";
import ColumnVisibilityMenu from "@features/review/shared/components/common/menu/ColumnVisibilityMenu";
import StatusSelect from "@features/review/shared/components/common/inputs/StatusSelect";
import ButtonsForMultipleSelection from "@features/review/shared/components/common/buttons/ButtonsForMultipleSelection";

import ArticleInterface from "@features/review/shared/types/ArticleInterface";

// Styles
import { inputconteiner } from "../../../shared/styles/executionStyles";

export default function Selection() {
  const [searchString, setSearchString] = useState<string>("");
  const [showSelected, setShowSelected] = useState<boolean>(false);
  const [fetchedTotalPages, setFetchedTotalPages] = useState<number>(1);
  const selectionContext = useContext(StudySelectionContext);
  const { t } = useTranslation("review/execution-selection");

  const { value: selectedStatus, handleChange: handleSelectChange } =
    useInputState<string | null>(null);

  const { layout, handleChangeLayout } = useLayoutPage();
  const { columnsVisible, toggleColumnVisibility } = useVisibiltyColumns({
    page: "Selection",
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof ArticleInterface;
    direction: "asc" | "desc";
  } | null>(null);

  const {
    currentPage,
    itensPerPage,
    setCurrentPage,
    handleNextPage,
    handlePrevPage,
    handleBackToInitial,
    handleGoToFinal,
    changeQuantityOfItens,
  } = usePaginationState({
    totalPages: fetchedTotalPages,
    initialSize: 20,
    setPage: selectionContext?.setPage,
    setSize: selectionContext?.setSize,
  });

  const handleHeaderClick = (key: keyof ArticleInterface) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    setCurrentPage(1);
  };

  const { articles, isLoading, totalElements, totalPages, mutate } =
    useFetchSelectionArticles({
      page: currentPage - 1,
      size: itensPerPage,
      search: searchString,
      status: selectedStatus,
      sortConfig,
    });

  if (totalPages && totalPages !== fetchedTotalPages) {
    setFetchedTotalPages(totalPages);
  }

  const safeSelectedArticles = selectionContext?.selectedArticles ?? {};

  const finalFilteredArticles = useMemo(() => {
    if (showSelected && Object.keys(safeSelectedArticles).length > 0) {
      const selectedIds = Object.keys(safeSelectedArticles).map(Number);
      return articles.filter((article) =>
        selectedIds.includes(article.studyReviewId)
      );
    }
    return articles;
  }, [showSelected, articles, safeSelectedArticles]);

  const handleTablePageChange = (page: number) => {
    setCurrentPage(page + 1);
  };

  return (
    <FlexLayout navigationType="Accordion">
      <Box w="100%" px="1rem" py=".75rem" h="fit-content">
        <Flex
          w="100%"
          h="2.5rem"
          justifyContent="space-between"
          alignItems="center"
          mb="2rem"
        >
          <Header text={t("header")} />
          <SelectLayout
            handleChangeLayout={handleChangeLayout}
            layout={layout}
          />
        </Flex>
        <Box sx={inputconteiner}>
          <Flex gap="1rem" w="1rem" justifyContent="space-between">
            <InputText
              type="search"
              placeholder={t("search")}
              nome="search"
              onChange={(e) => setSearchString(e.target.value)}
              value={searchString}
            />
            {layout !== "article" ? (
              <ButtonsForMultipleSelection
                onShowSelectedArticles={setShowSelected}
                isShown={showSelected}
              />
            ) : null}
          </Flex>
          <Box
            display="flex"
            gap="1rem"
            justifyContent="space-between"
            alignItems="center"
          >
            <ColumnVisibilityMenu
              columnsVisible={columnsVisible}
              toggleColumnVisibility={toggleColumnVisibility}
            />
            <StatusSelect
              selectedValue={selectedStatus}
              onSelect={handleSelectChange}
              page="Selection"
              totalCount={totalElements}
            />
          </Box>
        </Box>
      </Box>
      <Box
        w="calc(100% - 1.25rem)"
        h="calc(100vh - 10rem)"
        padding="0 0 0 .5rem"
      >
        <LayoutFactory
          page="Selection"
          articles={finalFilteredArticles}
          columnsVisible={columnsVisible}
          layout={layout}
          handleChangeLayout={handleChangeLayout}
          isLoading={isLoading}
          reloadArticles={mutate}
          sortConfig={sortConfig}
          handleHeaderClick={handleHeaderClick}
          onTablePageChange={handleTablePageChange}
          pagination={{
            currentPage,
            itensPerPage,
            quantityOfPages: totalPages,
            totalElements,
            handleNextPage,
            handlePrevPage,
            handleBackToInitial,
            handleGoToFinal,
            changeQuantityOfItens,
          }}
        />
      </Box>
    </FlexLayout>
  );
}
