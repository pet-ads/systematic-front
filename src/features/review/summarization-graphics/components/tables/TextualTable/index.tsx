// External library
import { useState } from "react";
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

// Hook
import usePagination from "@features/review/shared/hooks/usePagination";

// Components
import PaginationControl from "@features/review/shared/components/common/tables/ArticlesTable/subcomponents/controlls/PaginationControl";
import { Resizable } from "@features/review/shared/components/common/tables/ArticlesTable/subcomponents/Expanded/subcomponents/Resizable";

// Context
import { useExport } from "@features/review/summarization-graphics/context/ExportContext";

// Style
import {
  chevronIcon,
  collapsedSpanText,
} from "@features/review/execution-identification/pages/Identification/subcomponents/accordions/styles";
import type ArticleInterface from "@features/review/shared/types/ArticleInterface";


export type AllKeys =
| "studyReviewId"
| "authors"
| "title"
| "answer";

type Column = {
    key: AllKeys;
    label: string;
    width: string | number;
};


interface Props {
    articles: ArticleInterface[];
    sortConfig: { key: AllKeys; direction: "asc" | "desc" } | null;
    questionId: string;
}

export default function TextualTable({
    articles,
    sortConfig,
    questionId,
}: Props) {
  const ANSWER_ID = questionId;

  const { isExporting } = useExport();

  const [itensPerPageUI, setItensPerPageUI] = useState(20);

  const [columnWidths, setColumnWidths] = useState({
    studyReviewId: "100px",
    authors: "220px",
    title: "350px",
    answer: "350px",
  });

  const handleChangeItensPerPage = (value: number) => {
    setItensPerPageUI(value);
    changeQuantityOfItens(value);
  };

  const columns: Column[] = [
    {
      key: "studyReviewId",
      label: "ID",
      width: columnWidths.studyReviewId,
    },
    {
      key: "authors",
      label: "Autores",
      width: columnWidths.authors,
    },
    {
      key: "title",
      label: "Título",
      width: columnWidths.title,
    },
    {
      key: "answer",
      label: "Resposta",
      width: columnWidths.answer,
    },
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
  } = usePagination(articles);

  const handleColumnResize = (key: AllKeys, newWidth: number) => {
    setColumnWidths((prev) => ({
      ...prev,
      [key]: `${Math.max(62, Math.min(newWidth, 600))}px`,
    }));
  };

  return (
    <Box w="100%" maxH="82.5vh">
      <TableContainer
        w="100%"
        maxH="calc(100vh - 15rem)"
        borderRadius="1rem 1rem 0 0"
        boxShadow="lg"
        bg="white"
        overflowY="auto"
      >
        <Table
          variant="unstyled"
          colorScheme="black"
          size="md"
          layout="fixed"
        >
          <Thead
            bg="white"
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
                  textTransform="capitalize"
                  cursor={isExporting ? "default" : "pointer"}
                  w={isExporting ? "auto" : columnWidths[col.key]}
                >
                  <Resizable
                    direction="horizontal"
                    minWidth={62}
                    maxWidth={600}
                    onResize={(width) =>
                      handleColumnResize(col.key, width)
                    }
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
                          !isResizing
                        }
                      >
                        <Box
                          display="flex"
                          gap=".5rem"
                          justifyContent="center"
                          alignItems="center"
                          w="100%"
                          p="2rem 1rem 1rem 0"
                        >
                          <Text
                            flex="1"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                          >
                            {col.label}
                          </Text>

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
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {paginatedArticles.length > 0 ? (
              paginatedArticles.map((study, index) => {
                const answer =
                    (study as any).formAnswers?.[ANSWER_ID] ??
                    (study as any).robAnswers?.[ANSWER_ID] ??
                    "";

                return (
                  <Tr key={index}>
                    <Td w={columnWidths.studyReviewId}>
                      {study.studyReviewId}
                    </Td>

                    <Td w={columnWidths.authors}>
                      <Tooltip label={study.authors} hasArrow>
                        <Text sx={collapsedSpanTextChanged}>
                          {study.authors}
                        </Text>
                      </Tooltip>
                    </Td>

                    <Td w={columnWidths.title}>
                      <Tooltip label={study.title} hasArrow>
                        <Text sx={collapsedSpanTextChanged}>
                          {study.title}
                        </Text>
                      </Tooltip>
                    </Td>

                    <Td w={columnWidths.answer} lineHeight="150%">
                      <Tooltip label={answer} hasArrow>
                        <Text sx={collapsedSpanTextChanged}>
                          {answer}
                        </Text>
                      </Tooltip>
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <Tr>
                <Td colSpan={4} textAlign="center">
                  No studies found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <PaginationControl
        currentPage={currentPage}
        itensPerPage={itensPerPageUI}
        quantityOfPages={quantityOfPages}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleBackToInitial={handleBackToInitial}
        handleGoToFinal={handleGoToFinal}
        changeQuantityOfItens={handleChangeItensPerPage}
      />
    </Box>
  );
}