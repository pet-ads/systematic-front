import { FormControl, Menu, MenuButton, MenuList, MenuItem, Button, HStack, Checkbox, Text, Box, Divider } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { formControlStyle, menuListStyle, menuItemStyle, clearFiltersText } from "./styles";
import { capitalize } from "../../../../features/shared/utils/helpers/formatters/CapitalizeText";
import { FaCheckCircle, FaCopy, FaQuestionCircle, FaRegCircle, FaTimes } from "react-icons/fa";
import { ReactNode, useEffect, useRef, useState } from "react";

interface ISelectInputProps {
  values: string[];
  names: string[];
  onSelect: (selectValue: string | null) => void;
  selectedValue: string | null;
  placeholder?: string;
  page: string;
  showIcons?: boolean;
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
    <Box display="flex" alignItems="center" justifyContent="center" w="20px" h="20px" borderRadius="50%" bg={cfg.bg}>
      {cfg.icon}
    </Box>
  );
};

const splitLabelCount = (text: string) => {
  const parts = text.trim().split(" ");
  if (!isNaN(Number(parts[parts.length - 1]))) {
    const count = parts.pop();
    return { label: parts.join(" "), count };
  }
  return { label: text, count: "" };
};

export default function SelectInput({
  values,
  names,
  onSelect,
  selectedValue,
  placeholder,
  page,
  showIcons = true,
}: ISelectInputProps) {
  const isProtocol = page === "protocol";

  const handleClearFilters = () => onSelect(null);

  const selectedIndex = selectedValue ? values.indexOf(selectedValue) : -1;
  const selectedLabel = selectedIndex >= 0 ? capitalize(splitLabelCount(names[selectedIndex]).label) : placeholder;
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [menuWidth, setMenuWidth] = useState<number>(0);

  useEffect(() => {
    const update = () => setMenuWidth(btnRef.current?.offsetWidth ?? 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [selectedLabel]);

  return (
    <FormControl sx={formControlStyle} w={isProtocol ? "55%" : "20rem"}>
      <Menu isLazy>
        <MenuButton
          ref={btnRef}
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

        <MenuList
          {...menuListStyle}
          minW="unset"
          w={menuWidth ? `${menuWidth}px` : "100%"}
          maxW={menuWidth ? `${menuWidth}px` : "100%"}
        >
          {names.map((optionName, index) => {
            const value = values[index];
            const isSelected = value === selectedValue;
            const { label, count } = splitLabelCount(optionName);

            return (
              <MenuItem
                key={value}
                onClick={() => onSelect(value)}
                {...menuItemStyle(isSelected)}
                w="100%"
              >
                <HStack w="100%" spacing={3}>
                  <Checkbox isChecked={isSelected} pointerEvents="none" colorScheme="blue" />
                  {showIcons && getIcon(label)}
                  <Text flex="1" textAlign="left">{capitalize(label)}</Text>
                  {count && <Box>{count}</Box>}
                </HStack>
              </MenuItem>
            );
          })}

          <Divider borderColor="gray.300" />
          <MenuItem onClick={handleClearFilters} {...menuItemStyle(false)} w="100%">
            <Text {...clearFiltersText}>Clear filters</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </FormControl>
  );
}
