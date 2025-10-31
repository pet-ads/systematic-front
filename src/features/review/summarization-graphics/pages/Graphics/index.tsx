import { Box, Flex, Text } from "@chakra-ui/react";
import Header from "@components/structure/Header/Header";
import FlexLayout from "@components/structure/Flex/Flex";
import ChartsRenderer from "./subcomponents/ChartRenderer";
import SelectMenu from "../../components/menus/SelectMenu";
import { useGraphicsState } from "../../hooks/useGraphicsState";
import SectionMenu from "../../components/menus/SectionMenu";
import FiltersMenu from "../../components/menus/FilterMenu";
import { conteiner } from "./styles";

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
      <Header text="Graphics" />
      <Box sx={conteiner}>
        <Box
          display="flex"
          gap="1rem"
          flexWrap="wrap" 
          mb={5}
          alignItems="flex-start"
        >
          <Flex
            flexDirection="column"
            gap="2rem"
            alignItems="flex-start"
            minH="6rem"
          >
            <SectionMenu onSelect={handleSectionChange} selected={section} />
            {section === "Form Questions" ? (
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
            ) : (
              currentAllowedTypes.length > 0 && (
                <SelectMenu
                  options={currentAllowedTypes}
                  selected={type}
                  onSelect={setType}
                  placeholder="Choose Layout"
                />
              )
            )}
          </Flex>
        </Box>
        <Flex
          w="100%"
          mb="2rem"
          flexDirection="column"
          alignItems="flex-start"
          gap="0.5rem"
        >
          {filtersBySection[section]?.length > 0 && (
            <>
              <Text
                fontWeight="semibold"
                fontSize="lg"
                color="#263C56"
                mt="0.5rem"
              >
                Filters Area
              </Text>
              <FiltersMenu
                availableFilters={filtersBySection[section]}
                filters={filters}
                setFilters={setFilters}
              />
            </>
          )}
        </Flex>

        <ChartsRenderer
          key={section + type + JSON.stringify(filters)}
          section={section}
          type={type}
          filters={filters}
          selectedQuestionId={selectedQuestionId}
        />
      </Box>
    </FlexLayout>
  );
}
