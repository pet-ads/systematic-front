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

export default function Graphics() {
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
  const { t } = useTranslation("review/summarization-graphics");

  return (
    <FlexLayout navigationType="Accordion">
      <Flex justifyContent="space-between" alignItems="flex-start" w="100%" mb="1rem">
        
        <Flex flexDirection="column" gap="0.75rem">
          <Header text={t("header")} />

          {filtersBySection[section]?.length > 0 && (
            <Flex flexDirection="column" gap="0.5rem">
              <Text fontWeight="semibold" fontSize="lg" color="#263C56">
                {t("filtersArea.heading")}
              </Text>
              <FiltersMenu
                availableFilters={filtersBySection[section]}
                filters={filters}
                setFilters={setFilters}
              />
            </Flex>
          )}
        </Flex>

        <Flex flexDirection="column" gap="0.5rem" mt="0.75rem">
          <SectionMenu onSelect={handleSectionChange} selected={section} />
          {!(
            section === "Studies Funnel" ||
            section === "Form Questions" ||
            section === "Protocol"
          ) && (
            <SelectMenu
              options={currentAllowedTypes}
              selected={type}
              onSelect={setType}
              placeholder={t("selectMenu.chooseLayout")}
            />
          )}
          {section === "Form Questions" && (
            <SelectMenu
              options={allQuestions.filter((q) => q.questionId !== null)}
              selected={allQuestions.find(
                (q) => q.questionId === selectedQuestionId
              )}
              onSelect={(q) =>
                setSelectedQuestionId(q.questionId ?? undefined)
              }
              getLabel={(q) => q.code}
              getKey={(q) => q.questionId ?? q.code}
              placeholder="Choose Question"
            />
          )}
        </Flex>
      </Flex>

      <CardDefault
        backgroundColor="#fff"
        borderRadius="1rem"
        withShadow={false}
      >
        <ExportProvider>
          <ChartsRenderer
            key={section + type + JSON.stringify(filters) + selectedQuestionId}
            section={section}
            type={type}
            filters={filters}
            selectedQuestionId={selectedQuestionId}
          />
        </ExportProvider>
      </CardDefault>
    </FlexLayout>
  );
}