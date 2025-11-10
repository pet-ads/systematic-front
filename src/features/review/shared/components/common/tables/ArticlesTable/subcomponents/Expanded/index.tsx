// External library
import React, { useContext, useState } from "react";
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
  Checkbox,
  Box,
} from "@chakra-ui/react";

import { CheckCircleIcon, QuestionIcon, WarningIcon } from "@chakra-ui/icons";
import { FaChevronDown, FaChevronUp} from "react-icons/fa6";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";

import { RiCheckboxMultipleBlankFill } from "react-icons/ri";

// Context
import StudySelectionContext from "@features/review/shared/context/StudiesSelectionContext";

// Components
import PaginationControl from "../controlls/PaginationControl";
import { Resizable } from "./subcomponents/Resizable";

// Style
import {
  chevronIcon,
  collapsedSpanText,
  tdSX,
  tooltip,
} from "@features/review/execution-identification/pages/Identification/subcomponents/accordions/styles";

// Utils
import { capitalize } from "@features/shared/utils/helpers/formatters/CapitalizeText";

// Type
import type ArticleInterface from "@features/review/shared/types/ArticleInterface";
import type { ViewModel } from "@features/review/shared/hooks/useLayoutPage";
import type { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";
import { PaginationControls } from "@features/shared/types/pagination";

interface Props {
  articles: ArticleInterface[];
  handleHeaderClick: (key: keyof ArticleInterface) => void;
  sortConfig: { key: keyof ArticleInterface; direction: "asc" | "desc" } | null;
  layout?: ViewModel;
  columnsVisible: ColumnVisibility;
  onRowClick?: (article: ArticleInterface) => void;
  pagination: PaginationControls;
}

type HeaderKeys =
  | "studyReviewId"
  | "title"
  | "authors"
  | "venue"
  | "year"
  | "selectionStatus"
  | "extractionStatus"
  | "score"
  | "readingPriority";

type Column = {
  key: HeaderKeys;
  label: string;
  width: string | number;
};

export default function Expanded({
  articles,
  handleHeaderClick,
  sortConfig,
  layout,
  columnsVisible,
  onRowClick,
  pagination,
}: Props) {
  const [columnWidths, setColumnWidths] = useState({
    studyReviewId: "62px",
    title: "150px",
    authors: "100px",
    venue: "100px",
    year: "65px",
    selectionStatus: "90px",
    extractionStatus: "90px",
    score: "70px",
    readingPriority: "80px",
  });
  const studyContext = useContext(StudySelectionContext);

  const columns: Column[] = [
    { label: "ID", key: "studyReviewId", width: columnWidths.studyReviewId },
    { label: "Title", key: "title", width: columnWidths.title },
    { label: "Author", key: "authors", width: columnWidths.authors },
    { label: "Journal", key: "venue", width: columnWidths.venue },
    { label: "Year", key: "year", width: columnWidths.year },
    {
      label: "Selection",
      key: "selectionStatus",
      width: columnWidths.selectionStatus,
    },
    {
      label: "Extraction",
      key: "extractionStatus",
      width: columnWidths.extractionStatus,
    },
    { label: "Score", key: "score", width: columnWidths.score },
    {
      label: "Priority",
      key: "readingPriority",
      width: columnWidths.readingPriority,
    },
  ];

  const IconWrapper = ({ children, bg, size = "1.25rem"}: { children: React.ReactNode; bg?: string; size?: string; }) => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      w={size}
      h={size}
      borderRadius="full"
      bg={bg || "transparent"}
    >
      {children}
    </Box>
  );

  const statusIconMap: Record<string, React.ReactElement> = {
    INCLUDED: (
      <IconWrapper>
        <CheckCircleIcon color="green.500" boxSize="1rem" />
      </IconWrapper>
    ),
    DUPLICATED: (
      <IconWrapper>
        <WarningIcon color="blue.500" boxSize="1rem" />
      </IconWrapper>
    ),
    EXCLUDED: (
      <IconWrapper>
        <IoIosCloseCircle color="red" size="1.25rem" />
      </IconWrapper>
    ),
    UNCLASSIFIED: (
      <IconWrapper>
        <QuestionIcon color="yellow.500" boxSize="1rem" />
      </IconWrapper>
    ),
  };

  const renderStatusIcon = (status: string) => statusIconMap[status] || null;

  const priorityIconMap: Record<string, React.ReactElement> = {
    VERY_LOW: (
      <IconWrapper bg="red.500" size="1rem">
        <MdOutlineKeyboardDoubleArrowLeft color="white" size="1rem" />
      </IconWrapper>
    ),
    LOW: (
      <IconWrapper bg="yellow.500" size="1rem">
        <MdOutlineKeyboardArrowLeft color="white" size="1rem" />
      </IconWrapper>
    ),
    HIGH: (
      <IconWrapper bg="orange.500" size="1rem">
        <MdOutlineKeyboardArrowRight color="white" size="1rem" />
      </IconWrapper>
    ),
    VERY_HIGH: (
      <IconWrapper bg="green.500" size="1rem">
        <MdOutlineKeyboardDoubleArrowRight color="white" size="1rem" />
      </IconWrapper>
    ),
  };
  const renderPriorityIcon = (priority: string) => priorityIconMap[priority] || null;

  const {
    currentPage,
    itensPerPage,
    quantityOfPages,
    handleNextPage,
    handlePrevPage,
    handleBackToInitial,
    handleGoToFinal,
    changeQuantityOfItens,
  } = pagination;

  const handleColumnResize = (key: HeaderKeys, newWidth: number) => {
    setColumnWidths((prev) => {
      const newWidths = { ...prev };

      const visibleColumnsKeys = (Object.keys(prev) as HeaderKeys[]).filter(
        (colKey) => columnsVisible[`${colKey}`]
      );

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

        if (remainingDifference <= 0) {
          break;
        }
      }

      newWidths[key] = `${newWidth}px`;
      return newWidths;
    });
  };

  if (!studyContext) return;

  const {
    firstSelected,
    deletedArticles,
    toggleArticlesSelection,
    setSelectedArticleReview,
  } = studyContext;

  const collapsedSpanTextChanged = {
    ...collapsedSpanText,
    w: "auto",
    textAlign: "start",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <Box w="100%" maxH="82.5vh">
      <TableContainer
        w="100%"
        maxW="100%"
        minH={
          layout == "horizontal" || layout == "horizontal-invert"
            ? "16rem"
            : "calc(100vh - 16rem)"
        }
        maxH={
          layout == "horizontal" || layout == "horizontal-invert"
            ? "16rem"
            : "calc(100vh - 16rem)"
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
              <Th
                alignItems="center"
                justifyContent="center"
                color="#263C56"
                w="1rem"
                bg="white"
                paddingStart={"2rem"}
                paddingEnd={"0.3rem"}
              >
                <RiCheckboxMultipleBlankFill size="1rem" />
              </Th>
              {columns.map(
                (col) =>
                  columnsVisible[`${col.key}`] && (
                    <Th
                      key={col.key}
                      textAlign="center"
                      color="#263C56"
                      fontSize="medium"
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
                              !isResizing &&
                              handleHeaderClick(
                                col.key as keyof ArticleInterface
                              )
                            }
                          >
                            <Box
                              display="flex"
                              gap=".5rem"
                              justifyContent="center"
                              alignItems="center"
                              w="100%"
                              p=".25rem"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                            >
                              <Text
                                flex="1"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                textAlign="start"
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
                              width=".25rem"
                              cursor="col-resize"
                              zIndex={2}
                              _hover={{ bg: "#263C56" }}
                            />
                          </Box>
                        )}
                      </Resizable>
                    </Th>
                  )
              )}
            </Tr>
          </Thead>
          <Tbody>
            {articles.length > 0 ? (
              articles.map((reference, index) => (
                <Tr
                  key={index}
                  bg={
                    firstSelected == reference.studyReviewId
                      ? "#A8E6A2"
                      : deletedArticles.find(
                          (id) => id === reference.studyReviewId
                        )
                      ? "#F5B7B1"
                      : "transparent"
                  }
                  onClick={(e) => {
                    const target = e.target as HTMLElement;

                    if (
                      target.closest("input") ||
                      target.closest("label") ||
                      target.closest("button")
                    ) {
                      return;
                    }

                    setSelectedArticleReview(reference.studyReviewId);
                    onRowClick?.(reference);
                  }}
                  transition="background-color 0.3s, box-shadow 0.3s"
                  p="0"
                >
                  <Td textAlign="center" w="5%">
                    <Checkbox
                      isChecked={
                        !!studyContext?.selectedArticles[
                          reference.studyReviewId
                        ]
                      }
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleArticlesSelection(
                          reference.studyReviewId,
                          reference.title
                        )}
                      }
                      sx={{
                        borderColor: "#263C56",
                        _checked: {
                          bg: "#263C56",
                          borderColor: "#263C56",
                        },
                      }}
                    />
                  </Td>
                  <Td sx={tdSX} w={columnWidths.studyReviewId}>
                    <Tooltip
                      sx={tooltip}
                      label={reference.title}
                      aria-label="Full ID"
                      hasArrow
                    >
                      <Text sx={collapsedSpanTextChanged}>
                        {String(reference.studyReviewId).padStart(5, "0")}
                      </Text>
                    </Tooltip>
                  </Td>
                  {columnsVisible["title"] && (
                    <Td sx={tdSX} w={columnWidths.title}>
                      <Tooltip
                        sx={tooltip}
                        label={reference.title}
                        aria-label="Full Title"
                        hasArrow
                      >
                        <Text sx={collapsedSpanTextChanged}>
                          {reference.title}
                        </Text>
                      </Tooltip>
                    </Td>
                  )}
                  {columnsVisible["authors"] && (
                    <Td sx={tdSX} w={columnWidths.authors}>
                      <Tooltip
                        sx={tooltip}
                        label={reference.authors}
                        aria-label="Full Author List"
                        hasArrow
                      >
                        <Text sx={collapsedSpanTextChanged}>
                          {reference.authors}
                        </Text>
                      </Tooltip>
                    </Td>
                  )}
                  {columnsVisible["venue"] && (
                    <Td sx={tdSX} w={columnWidths.venue}>
                      <Tooltip
                        sx={tooltip}
                        label={reference.venue}
                        aria-label="Journal Name"
                        hasArrow
                      >
                        <Text sx={collapsedSpanTextChanged}>
                          {reference.venue}
                        </Text>
                      </Tooltip>
                    </Td>
                  )}
                  {columnsVisible["year"] && (
                    <Td sx={tdSX} w={columnWidths.year} pl={"2.2rem"}>
                      <Tooltip
                        sx={tooltip}
                        label={reference.year}
                        aria-label="Year of published"
                        hasArrow
                      >
                        <Text sx={collapsedSpanTextChanged}>
                          {reference.year}
                        </Text>
                      </Tooltip>
                    </Td>
                  )}
                  {columnsVisible["selectionStatus"] && (
                    <Td sx={tdSX} w={columnWidths.selectionStatus}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-start"
                        gap="0.5rem"
                      >
                        {renderStatusIcon(reference.selectionStatus)}
                        <Text sx={collapsedSpanTextChanged}>
                          {capitalize(
                            reference.selectionStatus
                              ?.toString()
                              .toLowerCase() || ""
                          )}
                        </Text>
                      </Box>
                    </Td>
                  )}
                  {columnsVisible["extractionStatus"] && (
                    <Td sx={tdSX} w={columnWidths.extractionStatus}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-start"
                        gap="0.5rem"
                      >
                        {renderStatusIcon(reference.extractionStatus)}
                        <Text sx={collapsedSpanTextChanged}>
                          {capitalize(
                            reference.extractionStatus
                              ?.toString()
                              .toLowerCase() || ""
                          )}
                        </Text>
                      </Box>
                    </Td>
                  )}
                  {columnsVisible["score"] && (
                    <Td sx={tdSX} w={columnWidths.score} pl="3rem">
                      <Tooltip
                        sx={tooltip}
                        label={reference.score}
                        aria-label="score of article"
                        hasArrow
                      >
                        <Text sx={collapsedSpanTextChanged}>
                          {reference.score}
                        </Text>
                      </Tooltip>
                    </Td>
                  )}
                  {columnsVisible["readingPriority"] && (
                    <Td
                      sx={tdSX}
                      w={columnWidths.readingPriority}
                      pl="2rem"
                      pr="0.5rem"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-start"
                        gap="0.7rem"
                      >
                        {renderPriorityIcon(reference.readingPriority?.toString())}
                        <Text sx={collapsedSpanTextChanged}>
                          {capitalize(
                            reference.readingPriority
                              ?.toString()
                              .toLowerCase() || ""
                          ).replace("_", " ")}
                        </Text>
                      </Box>
                    </Td>
                  )}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={8} textAlign="center">
                  No articles found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <PaginationControl
        itensPerPage={itensPerPage}
        currentPage={currentPage}
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
