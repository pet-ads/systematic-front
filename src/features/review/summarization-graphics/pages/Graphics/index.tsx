import { Flex, Text } from "@chakra-ui/react";
import Header from "@components/structure/Header/Header";
import FlexLayout from "@components/structure/Flex/Flex";
import CardDefault from "@components/common/cards";
import ChartsRenderer from "./subcomponents/ChartRenderer";
import SelectMenu from "../../components/menus/SelectMenu";
import { useGraphicsState } from "../../hooks/useGraphicsState";
import SectionMenu from "../../components/menus/SectionMenu";
import FiltersMenu from "../../components/menus/FilterMenu";
import { ExportProvider } from "../../context/ExportContext";
import { useTranslation } from "react-i18next";
import { useFetchExtractionQuestions } from "@features/review/execution-extraction/services/useFetchExtractionQuestions";
import { useFetchRobQuestions } from "@features/review/execution-extraction/services/useFetchRobQuestions";
import ColumnVisibilityMenu from "@features/review/shared/components/common/menu/ColumnVisibilityMenu";
import useVisibiltyColumns from "@features/review/shared/hooks/useVisibilityColumns";
import { PageLayout } from "@features/review/shared/components/structure/LayoutFactory";
import { useState, useEffect, useContext } from "react";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";
import AppContext from "@features/shared/context/ApplicationContext";

export default function Graphics() {
  const window = useWindowWidth();
  const context = useContext(AppContext);
  if(!context) return null;
  const { sidebarState, setSidebarState } = context;
  useEffect(() => {
    if(window < 1000 && sidebarState === "open") setSidebarState("collapsed");
  }, []);
  const {
    allQuestions,
    selectedQuestionId,
    setSelectedQuestionId,
    section,
    handleSectionChange,
    type,
    setType,
    filters,
    setFilters,
    filtersBySection,
    currentAllowedTypes,
  } = useGraphicsState();

  const { questions: extractionQuestions = [] } = useFetchExtractionQuestions();
  const { questions: robQuestions = [] } = useFetchRobQuestions();

  const [tablePage, setTablePage] = useState<PageLayout>("Graphics-SearchSources");

  const { t } = useTranslation("review/summarization-graphics");

  const handleUnifiedSelection = (value: string) => {
    const isQuestion = allQuestions.some(q => q.questionId === value);

    if (isQuestion) {
      handleSectionChange("Form Questions");
      setSelectedQuestionId(value);
    } else {
      handleSectionChange(value);
      setSelectedQuestionId(undefined);
    }
  };

  const { columnsVisible, toggleColumnVisibility } = useVisibiltyColumns({
    page: tablePage,
  });

  const tableMap: Record<string, PageLayout | null> = {
    "Search Sources": "Graphics-SearchSources",
    "Included Studies": "Graphics-IncludedStudies",
    "Form Questions": "Graphics-FormQuestions",
    "TEXTUAL": "Graphics-TextualQuestion",
  }

  useEffect(() => {
    const tableSelected = tableMap[section] ?? null;
    if(tableSelected) setTablePage(tableSelected);
  }, [section]);
  
  const currentFilters = filtersBySection[section] || [];
  const isNoYearSection = section && (
    section.toLowerCase().includes("inclusion") ||
    section.toLowerCase().includes("exclusion") ||
    section.toLowerCase().includes("inclusão") ||
    section.toLowerCase().includes("exclusão") ||
    section.toLowerCase().includes("form questions") || 
    section.toLowerCase().includes("questões") ||
    section.toLowerCase().includes("extração") ||
    section.toLowerCase().includes("viés")
  );

  const displayedFilters = isNoYearSection
    ? currentFilters.filter((f: any) => {
        const itemText = JSON.stringify(f).toLowerCase();
        return !itemText.includes("year") && !itemText.includes("ano");
      })
    : currentFilters;

  return (
    <FlexLayout navigationType="Accordion">
      <Flex justifyContent="space-between" alignItems="flex-start" w="100%" mb="1rem">
        <Flex flexDirection="column" gap="0.75rem">
          <Header text={t("header")} />

          {displayedFilters.length > 0 && window > 1000 && (
            <Flex flexDirection="column" gap="0.5rem">
              <Text fontWeight="semibold" fontSize="lg" color="#263C56">
                {t("filtersArea.heading")}
              </Text>
              <FiltersMenu
                availableFilters={displayedFilters}
                filters={filters}
                setFilters={setFilters}
              />
            </Flex>
          )}
        </Flex>

        <Flex gap="0.5rem" mt="0.75rem" alignItems="flex-end">
          {type === t("selectMenu.graphicsTypes.table") && (
            <ColumnVisibilityMenu
              columnsVisible={columnsVisible}
              toggleColumnVisibility={toggleColumnVisibility}
            />
          )}
          <Flex flexDirection="column" gap="0.5rem">
            <SectionMenu
              onSelect={handleUnifiedSelection}
              selected={selectedQuestionId || section}
              extractionQuestions={extractionQuestions.filter(q => q.questionId !== null)}
              robQuestions={robQuestions.filter(q => q.questionId !== null)}
            />
            {section && !(
              section === "Studies Funnel" ||
              section === "Protocol" ||
              currentAllowedTypes.length == 1
            ) && (
              <SelectMenu
                options={currentAllowedTypes}
                selected={type}
                onSelect={setType}
                placeholder={t("selectMenu.chooseLayout")}
              />
            )}
          </Flex>
        </Flex>
      </Flex>

      <CardDefault backgroundColor="#fff" borderRadius="1rem" withShadow={false}>
        <ExportProvider>
          {section ? (
            <ChartsRenderer
              key={section + type + JSON.stringify(filters) + selectedQuestionId}
              section={section}
              type={type}
              filters={filters}
              selectedQuestionId={selectedQuestionId}
              columnsVisible={columnsVisible}
              setTablePage={setTablePage}
            />
          ) : (
            <Flex direction="column" align="center" justify="center" h="100%" textAlign="center">
              <Text fontSize="34px" fontWeight="bold" color="#2E4B6C" mb="2">
                {t("graphicsArea.title")}
              </Text>
              <Text fontSize="19px" color="gray.600">
                {t("graphicsArea.instruction")}
              </Text>
            </Flex>
          )}
        </ExportProvider>
      </CardDefault>
    </FlexLayout>
  );
}