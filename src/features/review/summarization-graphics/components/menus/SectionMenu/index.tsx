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
  Tooltip,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

type MenuProps = {
  onSelect: (section: string) => void;
  selected: string;
  questions?: any[];
};

type Section = {
  label: string;
  value: string;
  group?: string;
  displayName?: string;
  tooltip?: string;
};

const getQuestionTooltip = (code: string, t: any): string => {
  const num = code.replace(/[^0-9]/g, "");
  if (code.startsWith("EQ")) return `Extraction Question ${num}`;
  if (code.startsWith("RBQ")) return `Risk of Bias Question ${num}`;
  return code;
};

export default function SectionMenu({ onSelect, selected, questions = [] }: MenuProps) {
  const { t } = useTranslation("review/summarization-graphics");

  const staticSections: Section[] = [
    {
      label: t("sectionMenu.sections.searchSources"),
      value: "Search Sources",
    },
    {
      label: t("sectionMenu.sections.s1InclusionCriteria"),
      value: "S1_Inclusion Criteria",
      group: "First Selection",
      displayName: `First Selection - ${t("sectionMenu.sections.s1InclusionCriteria")}`,
    },
    {
      label: t("sectionMenu.sections.s1ExclusionCriteria"),
      value: "S1_Exclusion Criteria",
      group: "First Selection",
      displayName: `First Selection - ${t("sectionMenu.sections.s1ExclusionCriteria")}`,
    },
    {
      label: t("sectionMenu.sections.s2InclusionCriteria"),
      value: "S2_Inclusion Criteria",
      group: "Second Selection",
      displayName: `Second Selection - ${t("sectionMenu.sections.s2InclusionCriteria")}`,
    },
    {
      label: t("sectionMenu.sections.s2ExclusionCriteria"),
      value: "S2_Exclusion Criteria",
      group: "Second Selection",
      displayName: `Second Selection - ${t("sectionMenu.sections.s2ExclusionCriteria")}`,
    },
    {
      label: t("sectionMenu.sections.studiesFunnel"),
      value: "Studies Funnel",
    },
    {
      label: t("sectionMenu.sections.includedStudies"),
      value: "Included Studies",
    },
  ];

  const allSections: Section[] = [
    ...staticSections,
    ...questions.map((q) => ({
      label: q.code,
      value: q.questionId,
      group: "Form Questions",
      displayName: `Form Question - ${q.code}`,
      tooltip: getQuestionTooltip(q.code, t),
    })),
  ];

  const groupedSections = allSections.reduce((acc, section) => {
    const group = section.group || "ungrouped";
    if (!acc[group]) acc[group] = [];
    acc[group].push(section);
    return acc;
  }, {} as Record<string, Section[]>);

  const current = allSections.find((s) => s.value === selected);

  return (
    <Menu>
      <MenuButton
        as={Button}
        w="24rem"
        bg="#EBF0F3"
        color="#2E4B6C"
        fontWeight="light"
        display="flex"
      >
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Box>
            {current ? (current.displayName || current.label) : t("sectionMenu.overview")}
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
        {Object.entries(groupedSections).map(([groupName, items]) => {
          const isUngrouped = groupName === "ungrouped";

          return (
            <Box key={groupName}>
              {!isUngrouped && (
                <MenuGroup
                  title={t(`sectionMenu.groups.${groupName.toLowerCase().replace(" ", "_")}`, groupName)}
                  bg="#EBF0F3"
                  ml="3"
                  fontSize="md"
                  fontWeight="bold"
                />
              )}
              {items.map((item) => (
                <Tooltip
                  key={item.value}
                  label={item.tooltip || ""}
                  placement="left"
                  hasArrow
                  isDisabled={!item.tooltip}
                  bg="#2E4B6C"
                  color="white"
                  borderRadius="md"
                  fontSize="sm"
                >
                  <MenuItem
                    onClick={() => onSelect(item.value)}
                    ml={isUngrouped ? "0" : "1"}
                    bg={selected === item.value ? "blue.100" : "transparent"}
                    _hover={{ bg: "blue.200" }}
                  >
                    {item.label}
                  </MenuItem>
                </Tooltip>
              ))}
            </Box>
          );
        })}
      </MenuList>
    </Menu>
  );
}