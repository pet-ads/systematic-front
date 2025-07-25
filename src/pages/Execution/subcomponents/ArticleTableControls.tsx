import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Checkbox,
  Box,
  Flex,
} from "@chakra-ui/react";
import { CgOptions } from "react-icons/cg";


import { ColumnVisibility } from "../../../hooks/tables/useVisibleColumns";
import { capitalize } from "../../../utils/CapitalizeText";

interface Props {
  visibleColumns: ColumnVisibility;
  toggleColumn: (column: keyof ColumnVisibility) => void;
}

export default function ColumnToggleMenu({
  visibleColumns,
  toggleColumn,
}: Props) {
  return (
    <Menu>
      <MenuButton
        as={Button}
        w="5rem"
        h="2.5rem"
        bg="#EBF0F3"
        color="#2E4B6C"
        fontWeight="light"
        display="flex"
        leftIcon={<CgOptions />}
        size="sm"
      >
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Box fontSize="1rem">View</Box>
        </Flex>
      </MenuButton>

      <MenuList bg="#EBF0F3" color="#2E4B6C" zIndex="2">
        {Object.entries(visibleColumns).map(([key, value]) => (
          <MenuItem
            key={key}
            onClick={() => toggleColumn(key as keyof ColumnVisibility)}
            _hover={{ bg: "blue.100" }}
          >
            <Flex align="center" gap="1rem" w="100%">
              <Checkbox isChecked={value} pointerEvents="none" />
              {capitalize(key)}
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
