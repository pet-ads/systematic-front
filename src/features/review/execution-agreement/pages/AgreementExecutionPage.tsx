import { useEffect, useMemo, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useContext } from "react";

import Header from "../../../../components/structure/Header/Header";
import FlexLayout from "../../../../components/structure/Flex/Flex";
import AppContext from "@features/shared/context/ApplicationContext";
import InputText from "../../../../components/common/inputs/InputText";
import SearchFieldSelect from "@features/review/shared/components/common/inputs/SearchFieldSelect";
import SelectVisualization,  { VisualizationMode } from "@features/review/shared/components/structure/VisualizationButton";
import type { SearchField } from "@features/review/shared/components/common/inputs/SearchFieldSelect";
import ColumnVisibilityMenu from "@features/review/shared/components/common/menu/ColumnVisibilityMenu";
import StatusSelect from "@features/review/shared/components/common/inputs/StatusSelect";
import useInputState from "@features/review/shared/hooks/useInputState";
import useLayoutPage from "@features/review/shared/hooks/useLayoutPage";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";
import type { ViewModel } from "@features/review/shared/hooks/useLayoutPage";
import AgreementTable, {
  mockStudies,
  type AgreementStudy,
} from "../components/AgreementTable";
import usePaginationState from "@features/shared/hooks/usePaginationState";
import { inputconteiner } from "@features/review/shared/styles/executionStyles";

type AgreementStage = "selection" | "extraction";

export default function AgreementExecutionPage({ stage }: { stage: AgreementStage }) {
  const window = useWindowWidth();
  const context = useContext(AppContext);
  const { sidebarState, setSidebarState } = context ?? {};
  useEffect(() => {
    if (window < 1000 && sidebarState === "open") setSidebarState?.("collapsed");
  }, [window, sidebarState, setSidebarState]);
  const { t } = useTranslation("review/agreement");
  const { t: selectionT } = useTranslation("review/execution-selection");
  const [studies] = useState<AgreementStudy[]>(mockStudies);
  const [searchString, setSearchString] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("title");
  const { value: selectedStatus, handleChange: handleStatusChange } = useInputState<string | null>(null);
  const { layout } = useLayoutPage();
  const [columnsVisible, setColumnsVisible] = useState<Record<string, boolean>>({
    id: true,
    title: true,
    author: true,
    year: true,
    João: true,
    Gabriel: true,
    Maria: true,
    decision: true,
    finalStatus: true,
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AgreementStudy;
    direction: "asc" | "desc";
  } | null>(null);
  const [visualization, setVisualization] = useState<VisualizationMode>("blocked");

  const filteredStudies = useMemo(() => {
    const search = searchString.trim().toLowerCase();
    return studies.filter((study) => {
      const searchableValue = searchField === "title" ? study.title : searchField === "authors" ? study.author : study.venue;
      const matchesSearch = !search || searchableValue.toLowerCase().includes(search);
      const matchesStatus = !selectedStatus || study.finalStatus.toUpperCase() === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchString, searchField, selectedStatus, studies]);

  const pagination = usePaginationState({
    totalPages: Math.ceil(filteredStudies.length / 20),
    initialSize: 20,
  });

  useEffect(() => {
    pagination.setCurrentPage(1);
  }, [searchString, searchField, selectedStatus]);

  const visibleStudies = filteredStudies.slice(
    (pagination.currentPage - 1) * pagination.itensPerPage,
    pagination.currentPage * pagination.itensPerPage,
  );

  const paginationWithTotal = {
    ...pagination,
    totalElements: filteredStudies.length,
  };

  const renderTable = (tableStudies: AgreementStudy[], showPagination = true) => (
    <AgreementTable
      studies={tableStudies}
      pagination={paginationWithTotal}
      columnsVisible={columnsVisible}
      sortConfig={sortConfig}
      onSort={handleSort}
      showPagination={showPagination}
    />
  );

  const handleSort = (key: keyof AgreementStudy) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleColumnVisibility = (column: string) => {
    setColumnsVisible((current) => ({ ...current, [column]: !current[column] }));
  };

  const agreementColumns = [
    { key: "title", label: t("columns.title") },
    { key: "author", label: t("columns.author") },
    { key: "year", label: t("columns.year") },
    { key: "João", label: "João" },
    { key: "Gabriel", label: "Gabriel" },
    { key: "Maria", label: "Maria" },
    { key: "decision", label: t("columns.decision") },
    { key: "finalStatus", label: t("columns.finalStatus") },
  ];

  const renderLayout = (currentLayout: ViewModel) => {
    const study = visibleStudies[0];
    const articlePreview = <Box h="100%" />;

    if (currentLayout === "horizontal" || currentLayout === "horizontal-invert") {
      const tablePanel = <Box flex="1" minH="0" overflow="hidden">{renderTable(visibleStudies)}</Box>;
      const articlePanel = <Box flex="1" minH="0" overflow="hidden">{articlePreview}</Box>;
      return (
        <Flex direction="column" gap="1rem" h="100%" overflow="hidden">
          {currentLayout === "horizontal" ? tablePanel : articlePanel}
          {currentLayout === "horizontal" ? articlePanel : tablePanel}
        </Flex>
      );
    }

    if (currentLayout === "vertical" || currentLayout === "vertical-invert") {
      const tablePanel = <Box flex="1" minW="0" overflow="hidden">{renderTable(visibleStudies)}</Box>;
      const articlePanel = <Box flex="1" minW="0" overflow="hidden">{articlePreview}</Box>;
      return (
        <Flex gap="1rem" h="100%" overflow="hidden">
          {currentLayout === "vertical" ? tablePanel : articlePanel}
          {currentLayout === "vertical" ? articlePanel : tablePanel}
        </Flex>
      );
    }

    if (currentLayout === "article") {
      return (
        <Flex direction="column" gap="1rem" h="100%" overflow="hidden">
          <Box flex="1" minH="0" overflow="hidden">
            {renderTable(study ? [study] : [])}
          </Box>
          {articlePreview}
        </Flex>
      );
    }

    return renderTable(visibleStudies);
  };

  return (
    <FlexLayout navigationType="Accordion">
      <Box w="100%" px="1rem" py=".75rem" h="fit-content">
        <Flex w="100%" h="2.5rem" justifyContent="space-between" alignItems="center" mb="2rem">
          <Header text={t(`headers.${stage}`)} />
          <SelectVisualization visualization={visualization} handleChangeVisualization={setVisualization} />
        </Flex>
        <Box sx={inputconteiner}>
          <Flex gap=".5rem" w="fit-content" justifyContent="space-between" alignItems="center">
            <SearchFieldSelect
              value={searchField}
              onChange={(field) => {
                setSearchField(field);
                setSearchString("");
              }}
              namespace="review/execution-selection"
            />
            <InputText
              type="search"
              placeholder={selectionT("search")}
              nome="search"
              onChange={(event) => setSearchString(event.target.value)}
              value={searchString}
            />
          </Flex>
          <Box
            display="flex"
            gap="1rem"
            justifyContent={{ base: "center", md: "flex-start", lg: "space-between" }}
            alignItems="center"
            ml={{ base: "0%", md: "-35%", lg: "0%" }}
          >
            <ColumnVisibilityMenu
              columnsVisible={columnsVisible}
              customColumns={agreementColumns}
              customColumnsVisible={columnsVisible}
              toggleCustomColumnVisibility={toggleColumnVisibility}
            />
            <StatusSelect
              selectedValue={selectedStatus}
              onSelect={handleStatusChange}
              page="Selection"
              totalCount={filteredStudies.length}
              statusOptions={["INCLUDED", "EXCLUDED", "UNCLASSIFIED"]}
            />
          </Box>
        </Box>
      </Box>
      <Box w="calc(100% - 0.5rem)" h="calc(100% - 1rem)" padding="0">
        {renderLayout(layout)}
      </Box>
    </FlexLayout>
  );
}