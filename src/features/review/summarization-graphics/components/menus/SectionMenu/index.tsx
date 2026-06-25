import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";

type MenuProps = {
  onSelect: (section: string) => void;
  selected: string;
  extractionQuestions?: any[];
  robQuestions?: any[];
};

type Section = {
  label: string;
  value: string;
  group?: string;
  displayName?: string;
};

export default function SectionMenu({
  onSelect,
  selected,
  extractionQuestions = [],
  robQuestions = [],
}: MenuProps) {
  const window = useWindowWidth();
  const { t } = useTranslation("review/summarization-graphics");

  const staticSections: Section[] = [
    {
      label: t("sectionMenu.sections.searchSources"),
      value: "Search Sources",
      group: "Overview",
    },
    {
      label: t("sectionMenu.sections.studiesFunnel"),
      value: "Studies Funnel",
      group: "Overview",
    },
    {
      label: t("sectionMenu.sections.includedStudies"),
      value: "Included Studies",
      group: "Overview",
    },
    {
      label: t("sectionMenu.sections.s1InclusionCriteria"),
      value: "S1_Inclusion Criteria",
      group: "First Selection",
      displayName: `${t("sectionMenu.groups.first_selection")} - ${t("sectionMenu.sections.s1InclusionCriteria")}`,
    },
    {
      label: t("sectionMenu.sections.s1ExclusionCriteria"),
      value: "S1_Exclusion Criteria",
      group: "First Selection",
      displayName: `${t("sectionMenu.groups.first_selection")} - ${t("sectionMenu.sections.s1ExclusionCriteria")}`,
    },
    {
      label: t("sectionMenu.sections.s2InclusionCriteria"),
      value: "S2_Inclusion Criteria",
      group: "Second Selection",
      displayName: `${t("sectionMenu.groups.second_selection")} - ${t("sectionMenu.sections.s2InclusionCriteria")}`,
    },
    {
      label: t("sectionMenu.sections.s2ExclusionCriteria"),
      value: "S2_Exclusion Criteria",
      group: "Second Selection",
      displayName: `${t("sectionMenu.groups.second_selection")} - ${t("sectionMenu.sections.s2ExclusionCriteria")}`,
    },
  ];

  const allSections: Section[] = [
    ...staticSections,
    ...extractionQuestions.map((q) => ({
      label: q.code,
      value: q.questionId,
      group: "Extraction Questions",
      displayName: `${t("sectionMenu.groups.extraction_questions")} - ${q.code}`,
    })),
    ...robQuestions.map((q) => ({
      label: q.code,
      value: q.questionId,
      group: "Risk of Bias Questions",
      displayName: `${t("sectionMenu.groups.risk_of_bias_questions")} - ${q.code}`,
    })),
  ];

  const groupedSections = allSections.reduce(
    (acc, section) => {
      const group = section.group || "ungrouped";
      if (!acc[group]) acc[group] = [];
      acc[group].push(section);
      return acc;
    },
    {} as Record<string, Section[]>,
  );

  const current = allSections.find((s) => s.value === selected);

  return (
    <Menu>
      <MenuButton
        as={Button}
        w={window > 1000 ? "24rem" : "20rem"}
        bg="#EBF0F3"
        color="#2E4B6C"
        fontWeight="light"
        display="flex"
      >
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Box>
            {current
              ? current.displayName || current.label
              : t("sectionMenu.chooseSection")}
          </Box>
          <ChevronDownIcon fontSize="1.25rem" />
        </Flex>
      </MenuButton>

      <MenuList
        bg="#EBF0F3"
        color="#2E4B6C"
        zIndex="2000"
        maxH="400px"
        overflowY="auto"
        overflowX="hidden"
      >
        {Object.entries(groupedSections).map(([groupName, items]) => (
          <Box key={groupName}>
            <MenuGroup
              title={t(
                `sectionMenu.groups.${groupName.toLowerCase().replace(/ /g, "_")}`,
                groupName,
              )}
              bg="#EBF0F3"
              ml="3"
              fontSize="md"
              fontWeight="bold"
            />

            {items.map((item) => (
              <MenuItem
                key={item.value}
                onClick={() => onSelect(item.value)}
                ml="1"
                bg={selected === item.value ? "blue.100" : "transparent"}
                _hover={{ bg: "blue.200" }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Box>
        ))}
      </MenuList>
    </Menu>
  );
}