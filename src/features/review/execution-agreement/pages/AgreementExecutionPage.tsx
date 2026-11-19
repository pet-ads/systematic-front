import { useEffect, useMemo, useState } from "react";
import { Alert, AlertIcon, Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useContext } from "react";

import Header from "../../../../components/structure/Header/Header";
import FlexLayout from "../../../../components/structure/Flex/Flex";
import AppContext from "@features/shared/context/ApplicationContext";
import InputText from "../../../../components/common/inputs/InputText";
import SearchFieldSelect from "@features/review/shared/components/common/inputs/SearchFieldSelect";
import type { SearchField } from "@features/review/shared/components/common/inputs/SearchFieldSelect";
import ColumnVisibilityMenu from "@features/review/shared/components/common/menu/ColumnVisibilityMenu";
import StatusSelect from "@features/review/shared/components/common/inputs/StatusSelect";
import useInputState from "@features/review/shared/hooks/useInputState";
import useLayoutPage from "@features/review/shared/hooks/useLayoutPage";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";
import type { ViewModel } from "@features/review/shared/hooks/useLayoutPage";
import AgreementTable, {
  type AgreementStudy,
  type ReviewerDecision,
} from "../components/AgreementTable";
import useFetchAgreementData from "../services/useFetchAgreementData";
import useAgreementReviews from "../services/useAgreementReviews";
import { judgeStudy } from "../services/judgeStudy";
import useToaster from "@components/feedback/Toaster";
import usePaginationState from "@features/shared/hooks/usePaginationState";
import AgreementVisibilityControl from "../components/AgreementTable/AgreementVisibilityControl";
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
  const {
    studies,
    reviewers,
    inclusionCriteria,
    exclusionCriteria,
    collaborators,
    canJudge,
    reloadStudies,
  } = useFetchAgreementData(stage);
  const toast = useToaster();
  const [searchString, setSearchString] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("title");
  const { value: selectedStatus, handleChange: handleStatusChange } = useInputState<string | null>(null);
  const { layout } = useLayoutPage();
  const [columnsVisible, setColumnsVisible] = useState<Record<string, boolean>>({
    id: true,
    title: true,
    author: true,
    year: true,
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

  const pageStudies = filteredStudies.slice(
    (pagination.currentPage - 1) * pagination.itensPerPage,
    pagination.currentPage * pagination.itensPerPage,
  );

  const { votesByStudy, canSeeReviews, reason, hasError } = useAgreementReviews(
    stage,
    pageStudies.map((study) => study.id)
  );

  const nameById = useMemo(
    () => Object.fromEntries(collaborators.map((c) => [c.id, c.username])) as Record<string, string>,
    [collaborators]
  );

  const reviewerColumns = useMemo(() => {
    const names = new Set(reviewers);
    Object.values(votesByStudy).forEach((votes) =>
      votes.forEach((vote) => {
        const name = nameById[vote.reviewerId];
        if (name) names.add(name);
      })
    );
    return Array.from(names);
  }, [reviewers, votesByStudy, nameById]);

  useEffect(() => {
    if (reviewerColumns.length === 0) return;
    setColumnsVisible((prev) => {
      const next = { ...prev };
      reviewerColumns.forEach((r) => { if (!(r in next)) next[r] = true; });
      return next;
    });
  }, [reviewerColumns]);

  const toDecision = (status: string): ReviewerDecision => {
    const value = status.toLowerCase();
    return value === "included" || value === "excluded" || value === "duplicated"
      ? value
      : "unclassified";
  };

  const visibleStudies: AgreementStudy[] = pageStudies.map((study) => {
    const reviewerDecisions: Record<string, ReviewerDecision> = {};
    const reviewerCriteria: Record<string, string[]> = {};
    (votesByStudy[study.id] ?? []).forEach((vote) => {
      const name = nameById[vote.reviewerId];
      if (!name) return;
      reviewerDecisions[name] = toDecision(vote.status);
      reviewerCriteria[name] = vote.criteria;
    });
    return { ...study, reviewerDecisions, reviewerCriteria };
  });

  const paginationWithTotal = {
    ...pagination,
    totalElements: filteredStudies.length,
  };

  const handleJudge = async (
    study: AgreementStudy,
    kind: "inclusion" | "exclusion",
    criteria: string[]
  ) => {
    try {
      await judgeStudy({
        stage,
        studyReviewId: study.id,
        kind,
        criteria,
        currentCriteria: study.currentCriteria,
      });
      toast({ title: t("judge.toast.successTitle"), status: "success" });
    } catch {
      toast({
        title: t("judge.toast.errorTitle"),
        description: t("judge.toast.errorDesc"),
        status: "error",
      });
    } finally {
      await reloadStudies();
    }
  };

  const renderTable = (tableStudies: AgreementStudy[], showPagination = true) => (
    <AgreementTable
      studies={tableStudies}
      reviewers={reviewerColumns}
      canJudge={canJudge}
      inclusionCriteria={inclusionCriteria}
      exclusionCriteria={exclusionCriteria}
      pagination={paginationWithTotal}
      columnsVisible={columnsVisible}
      sortConfig={sortConfig}
      onSort={handleSort}
      onJudge={handleJudge}
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
    ...reviewerColumns.map((r) => ({ key: r, label: r })),
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
        </Flex>
        {stage === "selection" && <AgreementVisibilityControl />}
        {hasError && (
          <Alert status="warning" borderRadius="md" mb="1rem">
            <AlertIcon />
            {t("reviews.loadError")}
          </Alert>
        )}
        {canSeeReviews === false && (
          <Alert status="info" borderRadius="md" mb="1rem">
            <AlertIcon />
            {t(reason === "NOT_FINISHED" ? "reviews.notFinished" : "reviews.hidden")}
          </Alert>
        )}
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