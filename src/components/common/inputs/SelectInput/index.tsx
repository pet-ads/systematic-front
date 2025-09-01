import { FormControl, Menu, MenuButton, MenuList, MenuItem, Button, HStack, Checkbox, Text, Box, Divider, Portal } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { formControlStyle, menuListStyle, menuItemStyle, clearFiltersText } from "./styles";
import { capitalize } from "../../../../features/shared/utils/helpers/formatters/CapitalizeText";
import { FaCheckCircle, FaCopy, FaQuestionCircle, FaRegCircle, FaTimes } from "react-icons/fa";
import { ReactNode } from "react";

interface ISelectInputProps {
  values: string[];
  names: string[];
  onSelect: (selectValue: string | null) => void;
  selectedValue: string | null;
  placeholder?: string;
  page: string;
}

type StatusKey = "included" | "duplicated" | "excluded" | "unclassified";

const iconConfig: Record<StatusKey, { icon: ReactNode; bg: string }> = {
  included: { icon: <FaCheckCircle color="white" size="12px" />, bg: "green" },
  duplicated: { icon: <FaCopy color="white" size="12px" />, bg: "blue" },
  excluded: { icon: <FaTimes color="white" size="12px" />, bg: "red" },
  unclassified: { icon: <FaQuestionCircle color="white" size="12px" />, bg: "gold" },
};

const getIcon = (label: string) => {
  const cfg = iconConfig[label.toLowerCase() as StatusKey];
  if (!cfg) return <FaRegCircle color="gray" />;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="20px"
      h="20px"
      borderRadius="50%"
      bg={cfg.bg}
    >
      {cfg.icon}
    </Box>
  );
};

const splitLabelCount = (text: string) => {
  const parts = text.trim().split(" ");
  const count = parts.pop();
  return { label: parts.join(" "), count };
};

export default function SelectInput({
  values,
  names,
  onSelect,
  selectedValue,
  placeholder,
  page,
}: ISelectInputProps) {
  const isProtocol = page === "protocol";

  const handleClearFilters = () => onSelect(null);

  const selectedIndex = selectedValue ? values.indexOf(selectedValue) : -1;

  const selectedLabel =
    selectedIndex >= 0
      ? capitalize(splitLabelCount(names[selectedIndex]).label)
      : placeholder;

  return (
    <FormControl sx={formControlStyle} w={isProtocol ? "55%" : "20rem"}>
      <Menu isLazy>
        <MenuButton
          as={Button}
          bgColor="#EBF0F3"
          color="#2E4B6C"
          rightIcon={<ChevronDownIcon />}
          w="100%"
          textAlign="left"
          fontWeight="normal"
        >
          {selectedLabel}
        </MenuButton>
        <Portal>
          <MenuList {...menuListStyle} w={isProtocol ? "55%" : "20rem"}>
            {names.map((optionName, index) => {
              const value = values[index];
              const isSelected = value === selectedValue;
              const { label, count } = splitLabelCount(optionName);

              return (
                <MenuItem
                  key={value}
                  onClick={() => onSelect(value)}
                  {...menuItemStyle(isSelected)}
                >
                  <HStack justify="space-between" w="100%">
                    <Checkbox
                      isChecked={isSelected}
                      pointerEvents="none"
                      colorScheme="blue"
                    />
                    {getIcon(label)}
                    <Text flex="1" textAlign="left" ml={2}>
                      {capitalize(label)}
                    </Text>
                    <Box>{count}</Box>
                  </HStack>
                </MenuItem>
              );
            })}

            <Divider borderColor="gray.300" />
            <MenuItem onClick={handleClearFilters} {...menuItemStyle(false)}>
              <Text {...clearFiltersText}>Clear filters</Text>
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>
    </FormControl>
  );
}