import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";

interface MenuOptionsProps {
  label?: string;
  options: string[];
  isDisabled?: boolean;
  icon?: ReactNode;
  onOptionToggle: (option: string) => void;
  closeOnSelect?: boolean;
}

export default function MenuOptions({
  label,
  options,
  isDisabled = false,
  icon,
  onOptionToggle,
  closeOnSelect = true,
}: MenuOptionsProps) {
  const [selected, setSelected] = useState<string>("");

  const handleChangeSelect = (value: string) => {
    setSelected(value);
    onOptionToggle(value);
    setSelected("");
  };

  return (
    <Menu closeOnSelect={closeOnSelect}>
      <MenuButton
        as={Button}
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap="0.5rem"
        bg="white"
        color="black"
        isDisabled={isDisabled}
      >
        {icon} {label}
      </MenuButton>

      <MenuList maxH="10rem" overflowY="auto">
        {options.map((option) => (
          <MenuItem
            key={option}
            maxW="25rem"
            overflow="auto"
            onClick={() => handleChangeSelect(option)}
            bg={selected === option ? "blue.100" : "transparent"}
            _hover={{ bg: "blue.50" }}
          >
            <Tooltip label={option} p="1rem" hasArrow>
              <Text
                isTruncated
                maxW="20rem"
                fontWeight={selected === option ? "bold" : "normal"}
              >
                {option}
              </Text>
            </Tooltip>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
