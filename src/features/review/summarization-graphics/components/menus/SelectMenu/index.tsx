import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

type SelectMenuProps<T> = {
  options: T[];
  selected?: T;
  onSelect: (option: T) => void;
  getLabel?: (option: T) => string;
  getKey?: (option: T) => string | number;
  placeholder: string;
};

export default function SelectMenu<T>({
  options,
  selected,
  onSelect,
  getLabel = (o) => String(o),
  getKey = (o) => String(o),
  placeholder,
}: SelectMenuProps<T>) {
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
            {selected ? getLabel(selected) : placeholder}
          </Box>
          <ChevronDownIcon fontSize="1.25rem" />
        </Flex>
      </MenuButton>

      <MenuList bg="#EBF0F3" color="#2E4B6C" zIndex="2000">
        {options.map((option) => (
          <MenuItem
            key={getKey(option)}
            onClick={() => onSelect(option)}
            bg={
              selected && getKey(selected) === getKey(option)
                ? "blue.100"
                : "transparent"
            }
            _hover={{ bg: "blue.200" }}
          >
            {getLabel(option)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
