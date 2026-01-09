// External library
import { useContext, useState } from "react";
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Tooltip,
  Box,
} from "@chakra-ui/react";

import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

// Context
import StudyContext from "@features/review/shared/context/StudiesContext";

// Hook
import usePagination from "@features/review/shared/hooks/usePagination";

// Style
import {
  chevronIcon,
  collapsedSpanText,
  tdSX,
} from "@features/review/execution-identification/pages/Identification/subcomponents/accordions/styles";

// Type
import type ArticleInterface from "@features/review/shared/types/ArticleInterface";
import type { ViewModel } from "@features/review/shared/hooks/useLayoutPage";
import PaginationControl from "@features/review/shared/components/common/tables/ArticlesTable/subcomponents/controlls/PaginationControl";
import { Resizable } from "@features/review/shared/components/common/tables/ArticlesTable/subcomponents/Expanded/subcomponents/Resizable";
import useFetchInclusionCriteria from "@features/review/shared/services/useFetchInclusionCriteria";
import { StudyInterface } from "@features/review/shared/types/IStudy";

export type AllKeys =
  | "studyReviewId"
  | "title"
  | "authors"
  | "venue"
  | "year"
  | "ic"
  | "searchSources"
  | "studyReviewId";

interface Props {
  articles: (ArticleInterface | StudyInterface)[];
  handleHeaderClick: (key: AllKeys) => void;
  sortConfig: { key: AllKeys; direction: "asc" | "desc" } | null;
  layout?: ViewModel;
}

type Column = {
  key: AllKeys;
  label: string;
  width: string | number;
};

export default function ChartExpanded({
  articles,
  handleHeaderClick,
  sortConfig,
  layout,
}: Props) {
  const [columnWidths, setColumnWidths] = useState({
    studyReviewId: "62px",
    title: "150px",
    authors: "150px",
    venue: "100px",
    year: "62px",
    searchSources: "100px",
    ic: "100px",
  });

  const studyContext = useContext(StudyContext);
  const inclusionCriterias = useFetchInclusionCriteria();

  if (!studyContext) return null;

  const columns: Column[] = [
    { key: "studyReviewId", label: "ID", width: columnWidths.studyReviewId },
    { key: "title", label: "Title", width: columnWidths.title },
    { key: "authors", label: "Author", width: columnWidths.authors },
    { key: "venue", label: "Journal", width: columnWidths.venue },
    { key: "year", label: "Year", width: columnWidths.year },
    {
      key: "searchSources",
      label: "Sources",
      width: columnWidths.searchSources,
    },
    { key: "ic", label: "IC", width: columnWidths.ic },
  ];

  const collapsedSpanTextChanged = {
    ...collapsedSpanText,
    w: "auto",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const {
    currentPage,
    quantityOfPages,
    paginatedArticles,
    handleNextPage,
    handlePrevPage,
    handleBackToInitial,
    handleGoToFinal,
    changeQuantityOfItens,
  } = usePagination(articles as ArticleInterface[]);

  const handleColumnResize = (key: AllKeys, newWidth: number) => {
    setColumnWidths((prev) => {
      const newWidths = { ...prev };
      const visibleColumnsKeys = Object.keys(prev) as AllKeys[];
      const columnIndex = visibleColumnsKeys.indexOf(key);

      const minWidth = 62;
      const maxWidth = 300;
      const currentWidth = parseFloat(prev[key]);
      newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
      let difference = newWidth - currentWidth;

      if (difference === 0 || columnIndex === visibleColumnsKeys.length - 1) {
        newWidths[key] = `${newWidth}px`;
        return newWidths;
      }

      let totalResizableWidth = 0;
      for (let i = columnIndex + 1; i < visibleColumnsKeys.length; i++) {
        totalResizableWidth +=
          parseFloat(prev[visibleColumnsKeys[i]]) - minWidth;
      }

      if (difference > totalResizableWidth) {
        const adjustedNewWidth = currentWidth + totalResizableWidth;
        newWidths[key] = `${adjustedNewWidth}px`;
        difference = adjustedNewWidth - currentWidth;

        for (let i = columnIndex + 1; i < visibleColumnsKeys.length; i++) {
          newWidths[visibleColumnsKeys[i]] = `${minWidth}px`;
        }
        return newWidths;
      }

      let remainingDifference = difference;
      for (let i = columnIndex + 1; i < visibleColumnsKeys.length; i++) {
        const nextColumnKey = visibleColumnsKeys[i];
        const nextColumnWidth = parseFloat(prev[nextColumnKey]);
        const spaceToReduce = nextColumnWidth - minWidth;
        const reduction = Math.min(remainingDifference, spaceToReduce);

        newWidths[nextColumnKey] = `${nextColumnWidth - reduction}px`;
        remainingDifference -= reduction;
        if (remainingDifference <= 0) break;
      }

      newWidths[key] = `${newWidth}px`;
      return newWidths;
    });
  };
  function isArticleInterface(
    study: ArticleInterface | StudyInterface
  ): study is ArticleInterface {
    return "studyReviewId" in study;
  }

  function isStudyInterface(
    study: ArticleInterface | StudyInterface
  ): study is StudyInterface {
    return "studyId" in study;
  }
  return (
    <Box w="100%" maxH="82.5vh">
      <TableContainer
        w="100%"
        minH={
          layout == "horizontal" || layout == "horizontal-invert"
            ? "15rem"
            : { base: "calc(100vh - 18rem)", md: "calc(100vh - 15rem)" }
        }
        maxH={
          layout == "horizontal" || layout == "horizontal-invert"
            ? "15rem"
            : "calc(100vh - 15rem)"
        }
        borderRadius="1rem 1rem 0 0"
        boxShadow="lg"
        bg="white"
        overflowY="auto"
      >
        <Table variant="unstyled" colorScheme="black" size="md" layout="fixed">
          <Thead
            bg="white"
            borderRadius="1rem"
            justifyContent="space-around"
            position="sticky"
            top="0"
            zIndex="1"
            borderBottom=".5rem solid #C9D9E5"
          >
            <Tr>
              {columns.map((col) => (
                <Th
                  key={col.key}
                  textAlign="center"
                  color="#263C56"
                  fontSize="larger"
                  p="0"
                  textTransform="capitalize"
                  cursor="pointer"
                  w={columnWidths[col.key]}
                >
                  <Resizable
                    direction="horizontal"
                    minWidth={62}
                    maxWidth={300}
                    onResize={(width) => handleColumnResize(col.key, width)}
                  >
                    {({ ref, isResizing }) => (
                      <Box
                        ref={ref}
                        position="relative"
                        h="100%"
                        w="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onClick={() =>
                          !isResizing && handleHeaderClick(col.key)
                        }
                      >
                        <Box
                          display="flex"
                          gap=".5rem"
                          justifyContent="center"
                          alignItems="center"
                          w="100%"
                          p="2rem 1rem 1rem 0"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          <Text
                            flex="1"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            textAlign="center"
                            px="0.5rem"
                          >
                            {col.label}
                          </Text>
                          {sortConfig?.key === col.key ? (
                            sortConfig.direction === "asc" ? (
                              <Box flexShrink={0}>
                                <FaChevronUp style={chevronIcon} />
                              </Box>
                            ) : (
                              <Box flexShrink={0}>
                                <FaChevronDown style={chevronIcon} />
                              </Box>
                            )
                          ) : (
                            <Box flexShrink={0}>
                              <FaChevronDown style={chevronIcon} />
                            </Box>
                          )}
                        </Box>
                        <Box
                          className="resize-handle"
                          position="absolute"
                          right="0"
                          top="0"
                          bottom="0"
                          width=".5rem"
                          cursor="col-resize"
                          zIndex={2}
                          _hover={{ bg: "#263C56" }}
                        />
                      </Box>
                    )}
                  </Resizable>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {paginatedArticles.length > 0 ? (
              paginatedArticles.map((study, index) => {
                const sourceText =
                  "searchSources" in study && Array.isArray(study.searchSources)
                    ? study.searchSources.join(", ")
                    : "";
                const criteriaText =
                  "criteria" in study && Array.isArray(study.criteria)
                    ? study.criteria
                        .map((cr) => {
                          const idx = inclusionCriterias.findIndex(
                            (item) => item === cr
                          );
                          //return `IC${idx + 1} : ${cr}`;
                          return `IC${idx + 1}`; //verificar depois
                        })
                        .join(" , ")
                    : "";

                return (
                  <Tr key={index} bg="transparent" p="0">
                    {columns.map((col) => {
                      let value: string | number = "";

                      switch (col.key) {
                        case "ic":
                          value = criteriaText;
                          break;
                        case "searchSources":
                          value = sourceText;
                          break;
                        case "studyReviewId":
                          value = study.studyReviewId ?? "";
                          break;
                        default:
                          if (isArticleInterface(study) && col.key in study) {
                            const val =
                              study[col.key as keyof ArticleInterface];
                            value = Array.isArray(val)
                              ? val.join(", ")
                              : val ?? "";
                          } else if (
                            isStudyInterface(study) &&
                            col.key in study
                          ) {
                            const val = study[col.key as keyof StudyInterface];
                            value = Array.isArray(val)
                              ? val.join(", ")
                              : val ?? "";
                          }
                          break;
                      }

                      return (
                        <Td key={col.key} sx={tdSX} w={columnWidths[col.key]}>
                          <Tooltip label={String(value)} hasArrow>
                            <Text sx={collapsedSpanTextChanged}>{value}</Text>
                          </Tooltip>
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })
            ) : (
              <Tr>
                <Td colSpan={columns.length + 1} textAlign="center">
                  No articles found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <PaginationControl
        currentPage={currentPage}
        itensPerPage={20}
        quantityOfPages={quantityOfPages}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleBackToInitial={handleBackToInitial}
        handleGoToFinal={handleGoToFinal}
        changeQuantityOfItens={changeQuantityOfItens}
      />
    </Box>
  );
}
