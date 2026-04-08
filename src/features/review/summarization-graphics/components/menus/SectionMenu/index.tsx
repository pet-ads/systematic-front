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

type MenuProps = {
  onSelect: (section: string) => void;
  selected: string;
  
};

type Section = {
  label: string;
  value: string;
  group?: string; 
};

const sections: Section[] = [
  { label: "Search Sources", value: "Search Sources" },
  { label: "Inclusion Criteria", value: "S1_Inclusion Criteria", group: "First Selection" },
  { label: "Exclusion Criteria", value: "S1_Exclusion Criteria", group: "First Selection" },
  { label: "Inclusion Criteria", value: "S2_Inclusion Criteria", group: "Second Selection" },
  { label: "Exclusion Criteria", value: "S2_Exclusion Criteria", group: "Second Selection" },
  { label: "Studies Funnel", value: "Studies Funnel" },
  { label: "Included Studies", value: "Included Studies" },
  { label: "Form Questions", value: "Form Questions" },
];

export default function SectionMenu({ onSelect, selected }: MenuProps) {
  
  const groupedSections = sections.reduce((acc, section) => {
    const group = section.group || "ungrouped";
    if (!acc[group]) acc[group] = [];
    acc[group].push(section);
    return acc;
  }, {} as Record<string, Section[]>);

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
          <Box>Choose Section</Box>
          <ChevronDownIcon fontSize="1.25rem" />
        </Flex>
      </MenuButton>

      <MenuList bg="#EBF0F3" color="#2E4B6C" zIndex="2000" >
        {Object.entries(groupedSections).map(([groupName, items]) => {
          const isUngrouped = groupName === "ungrouped";

          return (
            <Box key={groupName}>
              {!isUngrouped && <MenuGroup title={groupName} bg="#EBF0F3" ml="3" fontSize="md" fontWeight="bold" />}
              {items.map((item) => (
                <MenuItem
                  key={item.value}
                  onClick={() => onSelect(item.value)}
                  ml={isUngrouped ? "0" :"1"}
                   
        
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
