import {
  Box,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

import PaginationControl from "@features/review/shared/components/common/tables/ArticlesTable/subcomponents/controlls/PaginationControl";
import useGenericPagination from "@features/review/summarization-graphics/hooks/useGenericPaginations";

import { useExport } from "@features/review/summarization-graphics/context/ExportContext";

export type ColumnDef<T> = {
  key: keyof T;
  label: string;
  width: string | number;
  isNumeric?: boolean;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
};

export type SortConfig<T> = {
  key: keyof T;
  direction: "asc" | "desc";
} | null;

interface GenericExpandedTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
}

export function GenericExpandedTable<T>({
  data,
  columns,
}: GenericExpandedTableProps<T>) {
  const { isExporting } = useExport();

  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(null);

  const handleHeaderClick = (col: ColumnDef<T>) => {
    if (!col.sortable || isExporting) return;

    setSortConfig((prev) => {
      if (prev?.key === col.key) {
        return {
          key: col.key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key: col.key, direction: "asc" };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const { key, direction } = sortConfig;
    const column = columns.find((c) => c.key === key);

    return [...data].sort((a, b) => {
      const aVal = column?.sortValue ? column.sortValue(a) : (a[key] as any);
      const bVal = column?.sortValue ? column.sortValue(b) : (b[key] as any);

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return direction === "asc" ? -1 : 1;
      if (bVal == null) return direction === "asc" ? 1 : -1;

      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      return 0;
    });
  }, [data, sortConfig, columns]);

  const {
    currentPage,
    itensPerPage,
    quantityOfPages,
    paginatedItems,
    handleNextPage,
    handlePrevPage,
    handleBackToInitial,
    handleGoToFinal,
    changeQuantityOfItens,
  } = useGenericPagination<T>(sortedData);

  return (
    <Box w="100%">
      <TableContainer
        w="100%"
        maxH={isExporting ? "none" : "calc(100vh - 35rem)"}
        overflowY={isExporting ? "visible" : "auto"}
        borderRadius="1rem 1rem 0 0"
        boxShadow="lg"
        bg="white"
      >
        <Table variant="unstyled" size="md" layout="fixed">
          <Thead
            position={isExporting ? "static" : "sticky"}
            top={0}
            zIndex={1}
            bg="white"
            borderBottom=".5rem solid #C9D9E5"
          >
            <Tr>
              {columns.map((col) => {
                const isActive = sortConfig?.key === col.key;

                return (
                  <Th
                    key={String(col.key)}
                    position="relative"
                    fontSize="medium"
                    color="#263C56"
                    textTransform="none"
                    px={4}
                    cursor={
                      col.sortable && !isExporting ? "pointer" : "default"
                    }
                    whiteSpace={isExporting ? "normal" : "nowrap"}
                    verticalAlign="middle"
                    lineHeight={isExporting ? "1.6" : "normal"}
                    onClick={() => handleHeaderClick(col)}
                  >
                    {isExporting ? (
                      <Text wordBreak="break-word" px={2}>
                        {col.label}
                      </Text>
                    ) : (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap=".5rem"
                      >
                        <Text isTruncated>{col.label}</Text>

                        {col.sortable && (
                          <>
                            {isActive ? (
                              sortConfig?.direction === "asc" ? (
                                <FaChevronUp />
                              ) : (
                                <FaChevronDown />
                              )
                            ) : (
                              <FaChevronDown opacity={0.4} />
                            )}
                          </>
                        )}
                      </Box>
                    )}

                    {!isExporting && (
                      <Box
                        position="absolute"
                        top={0}
                        right={0}
                        h="100%"
                        w="6px"
                        cursor="col-resize"
                        zIndex={10}
                        _hover={{ bg: "blue.200" }}
                      />
                    )}
                  </Th>
                );
              })}
            </Tr>
          </Thead>

          <Tbody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((row, rowIndex) => (
                <Tr key={rowIndex}>
                  {columns.map((col) => {
                    const rawValue = row[col.key];
                    const value = col.render
                      ? col.render(row)
                      : String(rawValue ?? "");

                    return (
                      <Td
                        key={String(col.key)}
                        isNumeric={col.isNumeric}
                        verticalAlign="top"
                        whiteSpace={isExporting ? "normal" : "nowrap"}
                      >
                        {isExporting ? (
                          <Text wordBreak="break-word" lineHeight="1.6">
                            {value}
                          </Text>
                        ) : (
                          <Tooltip label={String(rawValue ?? "")} hasArrow>
                            <Text
                              isTruncated
                              textAlign={col.isNumeric ? "center" : "left"}
                            >
                              {value}
                            </Text>
                          </Tooltip>
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={columns.length} textAlign="center">
                  No data found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {!isExporting && (
        <PaginationControl
          currentPage={currentPage}
          itensPerPage={itensPerPage}
          quantityOfPages={quantityOfPages}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          handleBackToInitial={handleBackToInitial}
          handleGoToFinal={handleGoToFinal}
          changeQuantityOfItens={changeQuantityOfItens}
        />
      )}
    </Box>
  );
}
