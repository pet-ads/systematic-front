import { useState } from "react";
import {
  Box,
  Checkbox,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { CheckCircleIcon, ChevronDownIcon, QuestionIcon } from "@chakra-ui/icons";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { useTranslation } from "react-i18next";

import PaginationControl from "@features/review/shared/components/common/tables/ArticlesTable/subcomponents/controlls/PaginationControl";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";
import { chevronIcon, collapsedSpanText, tdSX, tooltip } from "@features/review/execution-identification/pages/Identification/subcomponents/accordions/styles";
import type { PaginationControls } from "@features/shared/types/pagination";

export type ReviewerDecision = "included" | "excluded";
export type FinalStatus = ReviewerDecision | "unclassified";

export interface AgreementStudy {
  id: number;
  title: string;
  author: string;
  venue: string;
  year: number;
  reviewerDecisions: Record<string, ReviewerDecision>;
  reviewerCriteria: Record<string, string[]>;
  finalStatus: FinalStatus;
}

interface AgreementTableProps {
  studies: AgreementStudy[];
  pagination: PaginationControls;
  columnsVisible: Record<string, boolean>;
  sortConfig: { key: keyof AgreementStudy; direction: "asc" | "desc" } | null;
  onSort: (key: keyof AgreementStudy) => void;
  showPagination?: boolean;
}

type HeaderKey = "id" | "title" | "author" | "year" | "reviewer" | "decision" | "finalStatus";

const reviewers = ["João", "Gabriel", "Maria"];
const inclusionCriteria = ["IC-01", "IC-02", "IC-03"];
const exclusionCriteria = ["EC-01", "EC-02", "EC-03"];

export const mockStudies: AgreementStudy[] = [
  { id: 1, title: "Título do estudo 1", author: "Autor do estudo 1", venue: "Periódico 1", year: 2026, reviewerDecisions: { João: "included", Gabriel: "excluded", Maria: "included" }, reviewerCriteria: { João: ["IC-01", "IC-03"], Gabriel: ["EC-02"], Maria: ["IC-01"] }, finalStatus: "included" },
  { id: 2, title: "Título do estudo 2", author: "Autor do estudo 2", venue: "Periódico 2", year: 2025, reviewerDecisions: { João: "excluded", Gabriel: "excluded", Maria: "included" }, reviewerCriteria: { João: ["EC-01"], Gabriel: ["EC-02", "EC-03"], Maria: ["IC-02", "IC-03"] }, finalStatus: "excluded" },
  { id: 3, title: "Título do estudo 3", author: "Autor do estudo 3", venue: "Periódico 3", year: 2024, reviewerDecisions: { João: "included", Gabriel: "included", Maria: "included" }, reviewerCriteria: { João: ["IC-02"], Gabriel: ["IC-01", "IC-02"], Maria: ["IC-01", "IC-03"] }, finalStatus: "unclassified" },
  { id: 4, title: "Título do estudo 4", author: "Autor do estudo 4", venue: "Periódico 4", year: 2023, reviewerDecisions: { João: "excluded", Gabriel: "included", Maria: "included" }, reviewerCriteria: { João: ["EC-01"], Gabriel: ["IC-01", "IC-02"], Maria: ["IC-01", "IC-03"] }, finalStatus: "unclassified" },
];

function Status({ status, label }: { status: ReviewerDecision | FinalStatus; label: string }) {
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" gap=".1rem" w="100%">
      <Flex alignItems="center" justifyContent="center" gap=".45rem" whiteSpace="nowrap" w="100%">
        {status === "included" && <CheckCircleIcon color="green.500" boxSize=".85rem" />}
        {status === "excluded" && <IoIosCloseCircle color="red" size="1rem" />}
        {status === "unclassified" && <QuestionIcon color="yellow.500" boxSize=".85rem" />}
        <Text sx={{ ...collapsedSpanText, w: "auto", textAlign: "center" }}>{label}</Text>
      </Flex>
    </Flex>
  );
}

function ReviewerCell({ decision, criteria, label }: { decision: ReviewerDecision; criteria: string[]; label: string }) {
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" w="100%">
      <Status status={decision} label={label} />
      <Text fontSize=".65rem" color="gray.600" whiteSpace="nowrap" textAlign="center">{criteria.join(", ")}</Text>
    </Flex>
  );
}

function DecisionMenu() {
  const { t } = useTranslation("review/agreement");
  const [checked, setChecked] = useState<string[]>([]);
  const toggle = (value: string) => setChecked((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);

  return (
    <Menu closeOnSelect={false}>
      <MenuButton as="button" className="ignore-row-click" border="1px solid #2E4B6C" borderRadius=".6rem" bg="white" color="#2E4B6C" px="1.1rem" py=".5rem" minW="8rem" whiteSpace="nowrap" style={{ width: "8rem", minWidth: "8rem", padding: ".5rem 1.1rem", borderRadius: ".6rem", boxShadow: "0 0 0 1px #2E4B6C", boxSizing: "border-box" }}>
        <Flex alignItems="center" justifyContent="space-between" gap=".6rem" whiteSpace="nowrap" overflow="visible"><Text fontSize="sm" flexShrink={0} whiteSpace="nowrap">{t("decisionMenu.judge")}</Text><ChevronDownIcon boxSize="1rem" flexShrink={0} /></Flex>
      </MenuButton>
      <MenuList minW="12rem" zIndex={10} p=".25rem 0">
        <Text px=".75rem" py=".2rem" fontSize="sm">{t("decisionMenu.inclusion")}</Text>
        {inclusionCriteria.map((criterion) => <MenuItem key={criterion}><Checkbox isChecked={checked.includes(criterion)} onChange={() => toggle(criterion)}>{criterion}</Checkbox></MenuItem>)}
        <Text px=".75rem" pt=".6rem" pb=".2rem" mt=".35rem" fontSize="sm" borderTop="1px solid #E2E8F0">{t("decisionMenu.exclusion")}</Text>
        {exclusionCriteria.map((criterion) => <MenuItem key={criterion}><Checkbox isChecked={checked.includes(criterion)} onChange={() => toggle(criterion)}>{criterion}</Checkbox></MenuItem>)}
      </MenuList>
    </Menu>
  );
}

export default function AgreementTable({ studies, pagination, columnsVisible, sortConfig, onSort, showPagination = true }: AgreementTableProps) {
  const window = useWindowWidth();
  const { t } = useTranslation("review/agreement");
  const columnWidths: Record<HeaderKey, string> = { id: "80px", title: "95px", author: "95px", year: "85px", reviewer: "100px", decision: "130px", finalStatus: "100px" };
  const columns: [string, string, string, boolean][] = [
    ["id", t("columns.studyId"), columnWidths.id, true],
    ["title", t("columns.title"), columnWidths.title, columnsVisible.title !== false],
    ["author", t("columns.author"), columnWidths.author, columnsVisible.author !== false],
    ["year", t("columns.year"), columnWidths.year, columnsVisible.year !== false],
    ...reviewers.map((reviewer) => [reviewer, reviewer, columnWidths.reviewer, columnsVisible[reviewer] !== false] as [string, string, string, boolean]),
    ["decision", t("columns.decision"), columnWidths.decision, columnsVisible.decision !== false] as [string, string, string, boolean],
    ["finalStatus", t("columns.finalStatus"), columnWidths.finalStatus, columnsVisible.finalStatus !== false] as [string, string, string, boolean],
  ];
  const sortKeys: Record<string, keyof AgreementStudy> = { id: "id", title: "title", author: "author", year: "year", finalStatus: "finalStatus" };
  const sortedStudies = [...studies].sort((first, second) => {
    if (!sortConfig) return first.id - second.id;
    const a = first[sortConfig.key];
    const b = second[sortConfig.key];
    if (a < b) return sortConfig.direction === "asc" ? -1 : 1;
    if (a > b) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const sort = (key: string) => { if (sortKeys[key]) onSort(sortKeys[key]); };
  const header = (key: string, label: string, width: string, centered = false) => (
    <Th key={key} textAlign="center" color="#263C56" fontSize={window > 1100 ? "medium" : "smaller"} textTransform="capitalize" cursor={sortKeys[key] ? "pointer" : "default"} w={width}>
      <Box position="relative" h="100%" w="100%" display="flex" alignItems="center" justifyContent="center" onClick={() => sort(key)}>
        <Box display="flex" gap=".5rem" justifyContent="center" alignItems="center" w="100%" p=".25rem" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap"><Text flex="1" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" textAlign={centered ? "center" : "start"} px=".5rem">{label}</Text>{sortKeys[key] && (sortConfig?.key === sortKeys[key] ? (sortConfig.direction === "asc" ? <FaChevronUp style={chevronIcon} /> : <FaChevronDown style={chevronIcon} />) : <FaChevronDown style={chevronIcon} />)}</Box>
      </Box>
    </Th>
  );

  return (
    <Box w="100%" h="100%" display="flex" flexDirection="column">
      <TableContainer flex="1" borderRadius="1rem 1rem 0 0" boxShadow="lg" bg="white" overflowY="auto">
        <Table variant="unstyled" colorScheme="black" size="md" layout="fixed" minW="68rem">
          <Thead bg="white" borderRadius="1rem" justifyContent="space-around" position="sticky" top="0" zIndex="1" borderBottom=".5rem solid #C9D9E5"><Tr>{columns.filter(([, , , visible]) => visible).map(([key, label, width]) => header(key, label, width, reviewers.includes(key) || key === "decision" || key === "finalStatus"))}</Tr></Thead>
          <Tbody>
            {sortedStudies.length === 0 && (
              <Tr>
                <Td colSpan={columns.filter(([, , , visible]) => visible).length} textAlign="center" py="2rem">
                  {t("noResults")}
                </Td>
              </Tr>
            )}
            {sortedStudies.map((study) => <Tr key={study.id} p="0">
              <Td sx={{ ...tdSX, textAlign: "start" }} w={columnWidths.id}><Tooltip sx={tooltip} label={study.title} aria-label="Full ID" hasArrow><Text sx={{ ...collapsedSpanText, w: "auto", textAlign: "start" }}>{String(study.id).padStart(5, "0")}</Text></Tooltip></Td>
              {columnsVisible.title !== false && <Td sx={{ ...tdSX, textAlign: "start" }} pl="1rem" w={columnWidths.title}><Tooltip sx={tooltip} label={study.title} aria-label="Full Title" hasArrow><Text sx={{ ...collapsedSpanText, w: "auto", textAlign: "start" }}>{study.title}</Text></Tooltip></Td>}
              {columnsVisible.author !== false && <Td sx={{ ...tdSX, textAlign: "start" }} w={columnWidths.author}><Tooltip sx={tooltip} label={study.author} aria-label="Full Author" hasArrow><Text sx={{ ...collapsedSpanText, w: "auto", textAlign: "start" }}>{study.author}</Text></Tooltip></Td>}
              {columnsVisible.year !== false && <Td sx={tdSX} w={columnWidths.year} pl="2.2rem"><Text sx={{ ...collapsedSpanText, w: "auto", textAlign: "start" }}>{study.year}</Text></Td>}
              {reviewers.map((reviewer) => columnsVisible[reviewer] !== false && <Td key={reviewer} sx={tdSX} w={columnWidths.reviewer}><ReviewerCell decision={study.reviewerDecisions[reviewer]} criteria={study.reviewerCriteria[reviewer]} label={t(`decisions.${study.reviewerDecisions[reviewer]}`)} /></Td>)}
              {columnsVisible.decision !== false && <Td sx={tdSX} w={columnWidths.decision}><DecisionMenu /></Td>}
              {columnsVisible.finalStatus !== false && <Td sx={tdSX} w={columnWidths.finalStatus}><Status status={study.finalStatus} label={t(`statuses.${study.finalStatus}`)} /></Td>}
            </Tr>)}
          </Tbody>
        </Table>
      </TableContainer>
      {showPagination && <PaginationControl itensPerPage={pagination.itensPerPage} currentPage={pagination.currentPage} quantityOfPages={pagination.quantityOfPages} handleNextPage={pagination.handleNextPage} handlePrevPage={pagination.handlePrevPage} handleBackToInitial={pagination.handleBackToInitial} handleGoToFinal={pagination.handleGoToFinal} changeQuantityOfItens={pagination.changeQuantityOfItens} />}
    </Box>
  );
}
