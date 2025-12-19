// External library
import { useContext, useMemo, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";

// Context
import StudySelectionContext from "@features/review/shared/context/StudiesSelectionContext";

// Hooks
import useInputState from "@features/review/shared/hooks/useInputState";
import useLayoutPage from "../../../shared/hooks/useLayoutPage";
import { useFilterReviewArticles } from "../../../shared/hooks/useFilterReviewArticles";
import useVisibiltyColumns from "@features/review/shared/hooks/useVisibilityColumns";

// Components
import Header from "../../../../../components/structure/Header/Header";
import FlexLayout from "../../../../../components/structure/Flex/Flex";
import InputText from "../../../../../components/common/inputs/InputText";
import LayoutFactory from "../../../shared/components/structure/LayoutFactory";
import SelectLayout from "../../../shared/components/structure/LayoutButton";
import ColumnVisibilityMenu from "@features/review/shared/components/common/menu/ColumnVisibilityMenu";
import StatusSelect from "@features/review/shared/components/common/inputs/StatusSelect";
import ButtonsForMultipleSelection from "@features/review/shared/components/common/buttons/ButtonsForMultipleSelection";

// Styles
import { inputconteiner } from "../../../shared/styles/executionStyles";

// Types
import useFetchSelectionArticles from "../../services/useFetchSelectionArticles";
import usePaginationState from "@features/shared/hooks/usePaginationState";

export default function Selection() {
  const [searchString, setSearchString] = useState<string>("");
  const [showSelected, setShowSelected] = useState<boolean>(false);
  const [fetchedTotalPages, setFetchedTotalPages] = useState<number>(1);
  const selectionContext = useContext(StudySelectionContext);
  const { value: selectedStatus, handleChange: handleSelectChange } =
    useInputState<string | null>(null);
  const { layout, handleChangeLayout } = useLayoutPage();
  const { columnsVisible, toggleColumnVisibility } = useVisibiltyColumns({
    page: "Selection",
  });

  const {
    currentPage,
    itensPerPage,
    handleNextPage,
    handlePrevPage,
    handleBackToInitial,
    handleGoToFinal,
    changeQuantityOfItens,
  } = usePaginationState({ totalPages: fetchedTotalPages, initialSize: 20 });

  const { articles, isLoading, totalElements, totalPages, mutate } =
    useFetchSelectionArticles({
      page: currentPage - 1,
      size: itensPerPage,
    });

  if (totalPages && totalPages !== fetchedTotalPages) {
    setFetchedTotalPages(totalPages);
  }

  const safeSelectedArticles = selectionContext?.selectedArticles ?? {};

  const startFilteredArticles = useFilterReviewArticles(
    searchString,
    selectedStatus,
    articles,
    "Selection"
  );

  const finalFilteredArticles = useMemo(() => {
    if (showSelected && Object.keys(safeSelectedArticles).length > 0) {
      const selectedIds = Object.keys(safeSelectedArticles).map(Number);
      return startFilteredArticles.filter((article) =>
        selectedIds.includes(article.studyReviewId)
      );
    }
    return startFilteredArticles;
  }, [showSelected, startFilteredArticles, safeSelectedArticles]);

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
          <Header text="Selection" />
          <SelectLayout handleChangeLayout={handleChangeLayout}/>
        </Flex>
        <Box sx={inputconteiner}>
          <Flex gap="1rem" w="1rem" justifyContent="space-between">
            <InputText
              type="search"
              placeholder="Insert article atribute"
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
              articles={articles}
              selectedValue={selectedStatus}
              onSelect={handleSelectChange}
              page="Selection"
              placeholder="Selection status"
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
