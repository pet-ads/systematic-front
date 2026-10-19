import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { useContext } from "react";

import Header from "../../../../components/structure/Header/Header";
import FlexLayout from "../../../../components/structure/Flex/Flex";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import AppContext from "@features/shared/context/ApplicationContext";
import InputText from "../../../../components/common/inputs/InputText";
import SearchFieldSelect from "@features/review/shared/components/common/inputs/SearchFieldSelect";
import type { SearchField } from "@features/review/shared/components/common/inputs/SearchFieldSelect";
import ColumnVisibilityMenu from "@features/review/shared/components/common/menu/ColumnVisibilityMenu";
import StatusSelect from "@features/review/shared/components/common/inputs/StatusSelect";
import useInputState from "@features/review/shared/hooks/useInputState";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";
import AgreementTable, {
  mockStudies,
  type AgreementStudy,
} from "../components/AgreementTable";
import usePaginationState from "@features/shared/hooks/usePaginationState";
import { inputconteiner } from "@features/review/shared/styles/executionStyles";
import { fetchCollaborators } from "../../planning-protocol/pages/GeneralDefinition/subcomponents/ResearcherFilter/services/useFetchCollaborators";

type AgreementStage = "selection" | "extraction";
type AgreementVisibility = "everyone" | "completed" | "nobody";

export default function AgreementExecutionPage({ stage }: { stage: AgreementStage }) {
  const window = useWindowWidth();
  const userId = useAuthStore((state) => state.user?.id);
  const [isAdmin, setIsAdmin] = useState(false);
  const context = useContext(AppContext);
  const { sidebarState, setSidebarState } = context ?? {};
  const [visibility, setVisibility] = useState<AgreementVisibility | null>(null);
  useEffect(() => {
    if (window < 1000 && sidebarState === "open") setSidebarState?.("collapsed");
  }, [window, sidebarState, setSidebarState]);
  useEffect(() => {
    const systematicStudyId = localStorage.getItem("systematicReviewId");
    if (!systematicStudyId || !userId) {
      setIsAdmin(false);
      return;
    }

    let isCurrent = true;
    fetchCollaborators(systematicStudyId)
      .then((collaborators) => {
        if (isCurrent) {
          setIsAdmin(
            collaborators.some(
              (collaborator) =>
                collaborator.id === userId && collaborator.role === "admin",
            ),
          );
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to check agreement visibility permissions", error);
        if (isCurrent) setIsAdmin(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [userId]);
  const { t } = useTranslation("review/agreement");
  const { t: selectionT } = useTranslation("review/execution-selection");
  const [studies] = useState<AgreementStudy[]>(mockStudies);
  const [searchString, setSearchString] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("title");
  const visibilityOptions: AgreementVisibility[] = ["everyone", "completed", "nobody"];
  const { value: selectedStatus, handleChange: handleStatusChange } = useInputState<string | null>(null);
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

  return (
    <FlexLayout navigationType="Accordion">
      <Box w="100%" px="1rem" py=".75rem" h="fit-content">
        <Flex w="100%" h="2.5rem" justifyContent="space-between" alignItems="center" mb="2rem">
          <Header text={t(`headers.${stage}`)} />
          {isAdmin && (
            <FormControl w={window > 1100 ? "20rem" : "15rem"}>
              <Menu isLazy>
                <MenuButton
                  as={Button}
                  bgColor="#EBF0F3"
                  color="#2E4B6C"
                  rightIcon={<ChevronDownIcon />}
                  w="100%"
                  textAlign="left"
                  fontWeight="normal"
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  <Text fontWeight="medium" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                    {visibility ? t(`visibility.${visibility}`) : t("visibility.placeholder")}
                  </Text>
                </MenuButton>
                <Portal>
                  <MenuList
                    minW="unset"
                    w={window > 1100 ? "20rem" : "15rem"}
                    maxW={window > 1100 ? "20rem" : "15rem"}
                    zIndex={1400}
                    p={0}
                    boxShadow="none"
                    overflow="hidden"
                  >
                    {visibilityOptions.map((option) => (
                      <MenuItem
                        key={option}
                        onClick={() => setVisibility(option)}
                        w="100%"
                        bg={visibility === option ? "rgb(190, 227, 248)" : "transparent"}
                        _hover={{ bg: "rgb(144, 205, 244)" }}
                      >
                        <Text flex="1" textAlign="left" color="#2E4B6C">
                          {t(`visibility.${option}`)}
                        </Text>
                      </MenuItem>
                    ))}
                    <Divider borderColor="gray.300" />
                    <MenuItem onClick={() => setVisibility(null)} w="100%">
                      <Text flex={1} textAlign="center" fontWeight="semibold" color="rgb(38, 60, 86)">
                        {t("visibility.clearFilters")}
                      </Text>
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </FormControl>
          )}
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
        {renderTable(visibleStudies)}
      </Box>
    </FlexLayout>
  );
}