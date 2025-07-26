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
import { CheckCircleIcon, InfoIcon, WarningIcon } from "@chakra-ui/icons";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import {
  MdKeyboardDoubleArrowUp,
  MdKeyboardDoubleArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { RiCheckboxMultipleBlankFill } from "react-icons/ri";

// Context
import StudySelectionContext from "../../../context/StudiesSelectionContext";

// Hook
import usePagination from "../../../hooks/tables/usePagination";

// Components
import PaginationControl from "./PaginationControl";
import { Resizable } from "./Resizable";

// Style
import {
  chevronIcon,
  collapsedSpanText,
  tdSX,
  tooltip,
} from "../../../pages/Execution/styles/CardsStyle";

// Utils
import { capitalize } from "../../../utils/CapitalizeText";

// Type
import type ArticleInterface from "../../../types/ArticleInterface";
import type { PageLayout } from "../../../pages/Execution/subcomponents/LayoutFactory";
import type { ViewModel } from "../../../hooks/useLayoutPage";

interface Props {
  articles: ArticleInterface[];
  handleHeaderClick: (key: keyof ArticleInterface) => void;
  sortConfig: { key: keyof ArticleInterface; direction: "asc" | "desc" } | null;
  page: PageLayout;
  layout?: ViewModel;
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
  | "priority";

type Column = {
  key: HeaderKeys;
  label: string;
  width: string | number;
};

export default function Expanded({
  articles,
  handleHeaderClick,
  sortConfig,
  page,
  layout,
}: Props) {
  const [columnWidths, setColumnWidths] = useState({
    studyReviewId: "3rem",
    title: "8rem",
    authors: "8rem",
    venue: "5rem",
    year: "3rem",
    selectionStatus: "5rem ",
    extractionStatus: "5rem ",
    score: "3rem",
    priority: "5rem ",
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
      width: columnWidths.selectionStatus,
    },
    { label: "Score", key: "score", width: columnWidths.score },
    { label: "Priority", key: "priority", width: columnWidths.priority },
  ];

  const statusIconMap: Record<string, React.ReactElement> = {
    INCLUDED: <CheckCircleIcon color="green.500" />,
    DUPLICATED: <InfoIcon color="blue.500" />,
    EXCLUDED: <IoIosCloseCircle color="red" size="1.4rem" />,
    UNCLASSIFIED: <WarningIcon color="yellow.500" />,
  };

  const priorityIconMap: Record<string, React.ReactElement> = {
    VERY_LOW: <MdKeyboardDoubleArrowDown color="#D32F2F" size="1.5rem" />,
    LOW: <MdKeyboardArrowDown color="#FBC02D" size="1.5rem" />,
    HIGH: <MdKeyboardArrowUp color="#F57C00" size="1.5rem" />,
    VERY_HIGH: <MdKeyboardDoubleArrowUp color="#388E3C" size="1.5rem" />,
  };

  const shouldShowColumn = (colKey: string) => {
    if (colKey === "selectionStatus")
      return page === "Selection" || page === "Identification";
    if (colKey === "extractionStatus")
      return page === "Extraction" || page === "Identification";
    return true;
  };

  const renderStatusIcon = (status: string) => statusIconMap[status] || null;
  const renderPriorityIcon = (priority: string) =>
    priorityIconMap[priority] || null;

  const {
    currentPage,
    setCurrentPage,
    quantityOfPages,
    paginatedArticles,
    handleNextPage,
    handlePrevPage,
  } = usePagination(articles);

  const handleColumnResize = (key: string, newWidth: number) => {
    setColumnWidths((prev) => ({
      ...prev,
      [key]: newWidth, 
    }));
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
    };

  return (
    <Box w="100%" maxH="82.5vh">
      <TableContainer
        w="100%"
        maxH={
          layout == "horizontal" || layout == "horizontal-invert"
            ? "15rem"
            : "calc(100vh - 15.5rem)"
        }
        borderRadius="1rem 1rem 0 0"
        boxShadow="lg"
        bg="white"
        overflowY="auto"
      >
        <Table
          variant="unstyled"
          colorScheme="black"
          size="md"
          boxShadow="md"
          layout="fixed"
        >
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
              >
                <RiCheckboxMultipleBlankFill size="1.25rem" />
              </Th>
              {columns.map(
                (col) =>
                  shouldShowColumn(col.key) && (
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
                        minWidth={50}
                        onResize={(width) => handleColumnResize(col.key, width)}
                      >
                        {({ ref, isResizing }) => (
                          <Box
                            ref={ref as React.LegacyRef<HTMLDivElement>} 
                            position="relative"
                            h="100%"
                            w="100%" 
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            onClick={() =>
                              !isResizing &&
                              handleHeaderClick(col.key as keyof ArticleInterface)
                            }
                          >
                            <Box
                              display="flex"
                              gap=".5rem"
                              justifyContent="center"
                              alignItems="center"
                              w="100%"
                              p="2rem 0 1rem 0"
                            >
                              {col.label}
                              {sortConfig?.key === col.key ? (
                                sortConfig.direction === "asc" ? (
                                  <FaChevronUp style={chevronIcon} />
                                ) : (
                                  <FaChevronDown style={chevronIcon} />
                                )
                              ) : (
                                <FaChevronDown style={chevronIcon} />
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
                  )
              )}
            </Tr>
          </Thead>
          <Tbody>
            {paginatedArticles.length > 0 ? (
              paginatedArticles.map((reference, index) => (
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
                  onClick={() => {
                    setSelectedArticleReview(reference.studyReviewId);
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
                      onChange={() =>
                        toggleArticlesSelection(
                          reference.studyReviewId,
                          reference.title
                        )
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
                  <Td sx={tdSX} w={columnWidths.title}>
                    <Tooltip
                      sx={tooltip}
                      label={reference.title}
                      aria-label="Full Title"
                      hasArrow
                    >
                      <Text sx={collapsedSpanTextChanged}>{reference.title}</Text>
                    </Tooltip>
                  </Td>
                  <Td sx={tdSX} w={columnWidths.authors}>
                    <Tooltip
                      sx={tooltip}
                      label={reference.authors}
                      aria-label="Full Author List"
                      hasArrow
                    >
                      <Text sx={collapsedSpanTextChanged}>{reference.authors}</Text>
                    </Tooltip>
                  </Td>
                  <Td sx={tdSX} w={columnWidths.venue}>
                    <Tooltip
                      sx={tooltip}
                      label={reference.venue}
                      aria-label="Journal Name"
                      hasArrow
                    >
                      <Text sx={collapsedSpanTextChanged}>{reference.venue}</Text>
                    </Tooltip>
                  </Td>
                  <Td sx={tdSX} w={columnWidths.year}>
                    <Tooltip
                      sx={tooltip}
                      label={reference.year}
                      aria-label="Year of published"
                      hasArrow
                    >
                      <Text sx={collapsedSpanTextChanged}>{reference.year}</Text>
                    </Tooltip>
                  </Td>
                  {page == "Selection" || page == "Identification" ? (
                    <Td sx={tdSX} w={columnWidths.selectionStatus}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
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
                  ) : null}
                  {page == "Extraction" || page == "Identification" ? (
                    <Td sx={tdSX} w={columnWidths.extractionStatus}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
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
                  ) : null}
                  <Td sx={tdSX} w={columnWidths.score}>
                    <Tooltip
                      sx={tooltip}
                      label={reference.score}
                      aria-label="score of article"
                      hasArrow
                    >
                      <Text sx={collapsedSpanTextChanged}>{reference.score}</Text>
                    </Tooltip>
                  </Td>
                  <Td sx={tdSX} w={columnWidths.priority}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap="0.5rem"
                    >
                      {renderPriorityIcon(reference.readingPriority)}
                      <Text sx={collapsedSpanTextChanged}>
                        {capitalize(
                          reference.readingPriority?.toString().toLowerCase() ||
                            ""
                        ).replace("_", " ")}
                      </Text>
                    </Box>
                  </Td>
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
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        quantityOfPages={quantityOfPages}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
      />
    </Box>
  );
}
