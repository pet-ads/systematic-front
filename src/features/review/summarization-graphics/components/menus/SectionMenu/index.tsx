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

type MenuProps = {
  onSelect: (section: string) => void;
  selected: string;
};

type Section = {
  label: string;
  value: string;
  group?: string;
  displayName?: string; 
};

export default function SectionMenu({ onSelect, selected }: MenuProps) {
  const { t } = useTranslation("review/summarization-graphics");

  const sections: Section[] = [
    { label: t("sectionMenu.sections.searchSources"), value: "Search Sources" },
    {
      label: t("sectionMenu.sections.s1InclusionCriteria"),
      value: "S1_Inclusion Criteria",
      group: "First Selection",
      displayName: "First Selection - Inclusion Criteria",
    },
    {
      label: t("sectionMenu.sections.s1ExclusionCriteria"),
      value: "S1_Exclusion Criteria",
      group: "First Selection",
      displayName: "First Selection - Exclusion Criteria",
    },
    {
      label: t("sectionMenu.sections.s2InclusionCriteria"),
      value: "S2_Inclusion Criteria",
      group: "Second Selection",
      displayName: "Second Selection - Inclusion Criteria",
    },
    {
      label: t("sectionMenu.sections.s2ExclusionCriteria"),
      value: "S2_Exclusion Criteria",
      group: "Second Selection",
      displayName: "Second Selection - Exclusion Criteria",
    },
    { label: t("sectionMenu.sections.studiesFunnel"), value: "Studies Funnel" },
    {
      label: t("sectionMenu.sections.includedStudies"),
      value: "Included Studies",
    },
    { label: t("sectionMenu.sections.formQuestions"), value: "Form Questions" },
  ];

  const groupedSections = sections.reduce(
    (acc, section) => {
      const group = section.group || "ungrouped";
      if (!acc[group]) acc[group] = [];
      acc[group].push(section);
      return acc;
    },
    {} as Record<string, Section[]>,
  );

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
            {(() => {
              const current = sections.find((s) => s.value === selected);
              if (!current) return t("sectionMenu.chooseSection");
              return current.displayName || current.label;
            })()}
          </Box>
          <ChevronDownIcon fontSize="1.25rem" />
        </Flex>
      </MenuButton>

      <MenuList bg="#EBF0F3" color="#2E4B6C" zIndex="2000">
        {Object.entries(groupedSections).map(([groupName, items]) => {
          const isUngrouped = groupName === "ungrouped";

          return (
            <Box key={groupName}>
              {!isUngrouped && (
                <MenuGroup
                  title={t(
                    `sectionMenu.groups.${groupName.toLowerCase().replace(" ", "_")}`,
                  )}
                  bg="#EBF0F3"
                  ml="3"
                  fontSize="md"
                  fontWeight="bold"
                />
              )}
              {items.map((item) => (
                <MenuItem
                  key={item.value}
                  onClick={() => onSelect(item.value)}
                  ml={isUngrouped ? "0" : "1"}
                  bg={selected === item.value ? "blue.100" : "transparent"}
                  _hover={{ bg: "blue.200" }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Box>
          );
        })}
      </MenuList>
    </Menu>
  );
}
