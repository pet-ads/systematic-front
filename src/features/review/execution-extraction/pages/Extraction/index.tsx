// External library
import { useContext, useMemo, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";

// Context
import StudySelectionContext from "@features/review/shared/context/StudiesSelectionContext";

// Hooks
import useLayoutPage from "../../../shared/hooks/useLayoutPage";
import { useFilterReviewArticles } from "../../../shared/hooks/useFilterReviewArticles";

// Components
import Header from "../../../../../components/structure/Header/Header";
import FlexLayout from "../../../../../components/structure/Flex/Flex";
import InputText from "../../../../../components/common/inputs/InputText";
import LayoutFactory from "../../../shared/components/structure/LayoutFactory";
import ButtonsForMultipleSelection from "../../../shared/components/common/buttons/ButtonsForMultipleSelection";
import SelectLayout from "../../../shared/components/structure/LayoutButton";
import ColumnVisibilityMenu from "@features/review/shared/components/common/menu/ColumnVisibilityMenu";
import StatusSelect from "@features/review/shared/components/common/inputs/StatusSelect";

// Styles
import { inputconteiner } from "../../../shared/styles/executionStyles";

// Types
import type ArticleInterface from "../../../shared/types/ArticleInterface";
import useVisibiltyColumns from "@features/review/shared/hooks/useVisibilityColumns";

export default function Extraction() {
  const [searchString, setSearchString] = useState<string>("");
  const [showSelected, setShowSelected] = useState<boolean>(false);
  const selectionContext = useContext(StudySelectionContext);

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { layout, handleChangeLayout } = useLayoutPage();

  const { columnsVisible, toggleColumnVisibility } = useVisibiltyColumns({
    page: "Extraction",
  });

  const safeArticles = selectionContext?.articles ?? [];
  const safeSelectedArticles = selectionContext?.selectedArticles ?? {};
  const isLoading = selectionContext?.isLoading ?? false;

  const allArticles: ArticleInterface[] = useMemo(() => {
    return safeArticles.filter(
      (art): art is ArticleInterface =>
        "studyReviewId" in art && art.selectionStatus == "INCLUDED"
    );
  }, [safeArticles]);

  const startFilteredArticles = useFilterReviewArticles(
    searchString,
    selectedStatus,
    allArticles,
    "Extraction"
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

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      INCLUDED: 0,
      DUPLICATED: 0,
      EXCLUDED: 0,
      UNCLASSIFIED: 0,
    };

    allArticles.forEach((article) => {
      const status = article.extractionStatus as keyof typeof counts;
      if (status && counts[status] !== undefined) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [allArticles]);

  const statusOptions = [
    { value: "INCLUDED", label: `Included (${statusCounts.INCLUDED})` },
    { value: "DUPLICATED", label: `Duplicated (${statusCounts.DUPLICATED})` },
    { value: "EXCLUDED", label: `Excluded (${statusCounts.EXCLUDED})` },
    {
      value: "UNCLASSIFIED",
      label: `Unclassified (${statusCounts.UNCLASSIFIED})`,
    },
  ];

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
            <Header text="Extraction" />
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
                names={statusOptions.map((opt) => opt.label)}
                values={statusOptions.map((opt) => opt.value)}
                onSelect={(value) => handleSelectChange(value)}
                selectedValue={selectedStatus}
                page={"extraction"}
                placeholder="Extraction status"
              />
            </Box>
          </Box>
          <Box w="100%" h="82.5vh">
            <LayoutFactory
              page="Extraction"
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