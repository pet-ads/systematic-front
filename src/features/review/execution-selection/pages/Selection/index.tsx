// External library
import { useContext, useMemo, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";

// Context
import StudySelectionContext from "@features/review/shared/context/StudiesSelectionContext";

// Hooks
import useInputState from "@features/review/shared/hooks/useInputState";
import useLayoutPage from "../../../shared/hooks/useLayoutPage";
import { useFilterReviewArticles } from "../../../shared/hooks/useFilterReviewArticles";

// Components
import Header from "../../../../../components/structure/Header/Header";
import FlexLayout from "../../../../../components/structure/Flex/Flex";
import InputText from "../../../../../components/common/inputs/InputText";
import SelectInput from "../../../../../components/common/inputs/SelectInput";
import LayoutFactory from "../../../shared/components/structure/LayoutFactory";
import ButtonsForMultipleSelection from "../../../shared/components/common/buttons/ButtonsForMultipleSelection";
import SelectLayout from "../../../shared/components/structure/LayoutButton";
import ColumnVisibilityMenu from "@features/review/shared/components/common/menu/ColumnVisibilityMenu";
import { capitalize } from "../../../../shared/utils/helpers/formatters/CapitalizeText";

// Styles
import { inputconteiner } from "../../../shared/styles/executionStyles";

// Types
import type ArticleInterface from "../../../shared/types/ArticleInterface";
import useVisibiltyColumns from "@features/review/shared/hooks/useVisibilityColumns";

export default function Selection() {
  const [searchString, setSearchString] = useState<string>("");
  const [showSelected, setShowSelected] = useState<boolean>(false);
  const selectionContext = useContext(StudySelectionContext);

  const { value: selectedStatus, handleChange: handleSelectChange } =
    useInputState<string | null>(null);
  const { layout, handleChangeLayout } = useLayoutPage();

  const { columnsVisible, toggleColumnVisibility } = useVisibiltyColumns({
    page: "Selection",
  });

  const safeArticles = selectionContext?.articles ?? [];
  const safeSelectedArticles = selectionContext?.selectedArticles ?? {};
  const isLoading = selectionContext?.isLoading ?? false;

  const allArticles: ArticleInterface[] = useMemo(() => {
    return safeArticles.filter(
      (art): art is ArticleInterface => "studyReviewId" in art
    );
  }, [safeArticles]);

  const startFilteredArticles = useFilterReviewArticles(
    searchString,
    selectedStatus,
    allArticles,
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
    <FlexLayout defaultOpen={1} navigationType="Accordion">
      <Box w="98%" m="1rem" h="fit-content">
        <Box
          w="100%"
          h="100%"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Flex
            w="100%"
            h="2.5rem"
            justifyContent="space-between"
            alignItems="center"
            mb="2rem"
          >
            <Header text="Selection" />
            <SelectLayout handleChangeLayout={handleChangeLayout} />
          </Flex>
          <Box sx={inputconteiner}>
            <Flex gap="1rem" w="35%" justifyContent="space-between">
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
              <SelectInput
                names={[
                  capitalize("included"), capitalize("duplicated"), capitalize("excluded"), capitalize("unclassified"),
                ]}
                values={["INCLUDED", "DUPLICATED", "EXCLUDED", "UNCLASSIFIED"]}
                onSelect={(value) => handleSelectChange(value)}
                selectedValue={selectedStatus}
                page={"selection"}
                placeholder="Selection status"
              />
            </Box>
          </Box>
          <Box w="100%" h="82.5vh">
            <LayoutFactory
              page="Selection"
              articles={finalFilteredArticles}
              columnsVisible={columnsVisible}
              layout={layout}
              isLoading={isLoading}
            />
          </Box>
        </Box>
      </Box>
    </FlexLayout>
  );
}
