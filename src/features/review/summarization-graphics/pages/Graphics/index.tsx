import { Box, Flex, Text } from "@chakra-ui/react";
import Header from "@components/structure/Header/Header";
import FlexLayout from "@components/structure/Flex/Flex";
import ChartsRenderer from "./subcomponents/ChartRenderer";
import SelectMenu from "../../components/menus/SelectMenu";
import { useGraphicsState } from "../../hooks/useGraphicsState";
import SectionMenu from "../../components/menus/SectionMenu";
import FiltersMenu from "../../components/menus/FilterMenu";
import { ExportProvider } from "../../context/ExportContext";

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

  return (
    <FlexLayout navigationType="Accordion">
    <Box w="100%" ml="-0.5rem" pl="0" pr="1rem" py=".75rem" h="fit-content">
        <Flex justifyContent={"space-between"} w={"100%"}>
          <Flex w="100%" h="2.5rem" alignItems="center" mb="1rem">
            <Header text="Graphics" />
          </Flex>
            <Flex flexDirection="column" gap="0.5rem">
              <SectionMenu onSelect={handleSectionChange} selected={section} />
              {section !== "Studies Funnel" && 
              (
                <SelectMenu
                  options={currentAllowedTypes}
                  selected={type}
                  onSelect={setType}
                  placeholder="Choose Layout"
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
        {/* Filters Area */}
        {filtersBySection[section]?.length > 0 && (
          <Box mb="1rem">
            <Text
              fontWeight="semibold"
              fontSize="lg"
              color="#263C56"
              mb="0.5rem"
            >
              Filters Area
            </Text>
            <FiltersMenu
              availableFilters={filtersBySection[section]}
              filters={filters}
              setFilters={setFilters}
            />
          </Box>
        )}

        {/* Charts */}
            <ExportProvider>
                 <ChartsRenderer
          key={section + type + JSON.stringify(filters) + selectedQuestionId}
          section={section}
          type={type}
          filters={filters}
          selectedQuestionId={selectedQuestionId}
        />

            </ExportProvider>
     
      </Box>
    </FlexLayout>
  );
}
