import {Box,Table,TableContainer,Tbody,Td,Text,Th,Thead,Tooltip,Tr} from "@chakra-ui/react";
import { useMemo } from "react";

import PaginationControl from "@features/review/shared/components/common/tables/ArticlesTable/subcomponents/controlls/PaginationControl";
import { useExport } from "@features/review/summarization-graphics/context/ExportContext";
import useGenericPagination from "@features/review/summarization-graphics/hooks/useGenericPaginations";
import DownloadChartsButton from "@features/review/summarization-graphics/components/buttons/DownloadChatsButton";

interface PickManyItemRow {
  studyId: number;
  selections: Record<string, boolean>;
}

interface Props {
  data: Record<string, number[]>;
  options: string[];
  studyIds: number[];
}

function parsePickManyLabel(label: string): string[] {
  const trimmed = label.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [trimmed];
}

function buildSelectionMap(
  data: Record<string, number[]>
): Map<number, Set<string>> {
  const map = new Map<number, Set<string>>();

  Object.entries(data).forEach(([label, ids]) => {
    const selected = parsePickManyLabel(label);
    ids.forEach((id) => {
      if (!map.has(id)) map.set(id, new Set());
      selected.forEach((opt) => map.get(id)!.add(opt));
    });
  });

  return map;
}

export function PickManyItemTable({ data, options, studyIds }: Props) {
  const { isExporting, downloadConfig } = useExport();

  const selectionMap = useMemo(() => buildSelectionMap(data), [data]);

  const rows: PickManyItemRow[] = useMemo(() => {
    return studyIds
      .filter((id) => selectionMap.has(id))
      .map((id) => ({
        studyId: id,
        selections: Object.fromEntries(
          options.map((opt) => [opt, selectionMap.get(id)?.has(opt) ?? false])
        ),
      }));
  }, [studyIds, selectionMap, options]);

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
  } = useGenericPagination<PickManyItemRow>(rows, 20);

  const downloadButton = downloadConfig ? (
    <DownloadChartsButton
      selector={downloadConfig.selector}
      fileName={downloadConfig.fileName}
      onDownloadCsv={downloadConfig.onDownloadCsv}
    />
  ) : undefined;

  return (
    <Box w="100%" h="100%" display="flex" flexDirection="column" minH={0} flex="1">
      <TableContainer
        w="100%"
        flex="1"
        minH={0}
        overflowY={isExporting ? "visible" : "auto"}
        overflowX="auto"
        borderRadius="1rem 1rem 0 0"
        bg="white"
      >
        <Table variant="unstyled" size="md">
          <Thead
            position={isExporting ? "static" : "sticky"}
            top={0}
            zIndex={1}
            bg="white"
            borderBottom=".5rem solid #C9D9E5"
          >
            <Tr>
              <Th
                fontSize="medium"
                color="#263C56"
                textTransform="none"
                px={4}
                minW="56px"
              >
                ID
              </Th>

              {options.map((opt) => (
                <Th
                  key={opt}
                  fontSize="medium"
                  color="#263C56"
                  textTransform="none"
                  px={4}
                  minW="80px"
                  textAlign="center"
                >
                  {isExporting ? (
                    <Text wordBreak="break-word" px={2}>
                      {opt}
                    </Text>
                  ) : (
                    <Tooltip label={opt} hasArrow>
                      <Text isTruncated maxW="120px">
                        {opt}
                      </Text>
                    </Tooltip>
                  )}
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((row) => (
                <Tr key={row.studyId}>
                  <Td px={4} verticalAlign="top">
                    <Text>{row.studyId}</Text>
                  </Td>

                  {options.map((opt) => (
                    <Td
                      key={opt}
                      textAlign="center"
                      verticalAlign="top"
                      px={4}
                      color={row.selections[opt] ? "green.500" : "red.400"}
                      fontWeight="semibold"
                    >
                      {row.selections[opt] ? "✓" : "✗"}
                    </Td>
                  ))}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={options.length + 1} textAlign="center">
                  No data found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {!isExporting && (
        <Box flexShrink={0} borderTop="1px solid #E2E8F0">
          <PaginationControl
            currentPage={currentPage}
            itensPerPage={itensPerPage}
            quantityOfPages={quantityOfPages}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            handleBackToInitial={handleBackToInitial}
            handleGoToFinal={handleGoToFinal}
            changeQuantityOfItens={changeQuantityOfItens}
            rightElement={downloadButton}
          />
        </Box>
      )}
    </Box>
  );
}