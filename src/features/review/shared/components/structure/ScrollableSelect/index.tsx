import { useRef } from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  type ButtonProps,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

export interface ScrollableSelectOption {
  value: string;
  label: string;
}

interface ScrollableSelectProps {
  value: string;
  options: ScrollableSelectOption[];
  onChange: (value: string) => void;
  visibleItems?: number;
  itemHeight?: string;
  fieldStyle?: ButtonProps;
}

export default function ScrollableSelect({
  value,
  options,
  onChange,
  visibleItems = 6,
  itemHeight = "2.5rem",
  fieldStyle,
}: ScrollableSelectProps) {
  const selectedRef = useRef<HTMLButtonElement>(null);
  const selected = options.find((option) => option.value === value);

  return (
    <Menu
      matchWidth
      strategy="fixed"
      autoSelect={false}
      onOpen={() => {
        setTimeout(() => selectedRef.current?.scrollIntoView({ block: "center" }), 0);
      }}
    >
      <MenuButton
        as={Button}
        w="100%"
        h="2.5rem"
        textAlign="left"
        justifyContent="space-between"
        fontWeight="normal"
        rightIcon={<ChevronDownIcon />}
        _hover={{ bg: "gray.100" }}
        _active={{ bg: "gray.100" }}
        {...fieldStyle}
      >
        {selected?.label ?? ""}
      </MenuButton>
      <MenuList
        maxH={`calc(${visibleItems} * ${itemHeight})`}
        overflowY="auto"
        py="0"
        zIndex="2"
      >
        <MenuOptionGroup
          type="radio"
          value={value}
          onChange={(newValue) => onChange(newValue as string)}
        >
          {options.map((option) => (
            <MenuItemOption
              key={option.value}
              value={option.value}
              h={itemHeight}
              ref={option.value === value ? selectedRef : undefined}
            >
              {option.label}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}