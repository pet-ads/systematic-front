import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import { BsTable } from "react-icons/bs";
import { PiArticleMediumBold } from "react-icons/pi";

import { RiFlipHorizontalLine } from "react-icons/ri";

import { ViewModel } from "../../../hooks/useLayoutPage";

import React from "react";
import { capitalize } from "../../../../../shared/utils/helpers/formatters/CapitalizeText";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface SelectLayoutProps {
  handleChangeLayout: (newLayout: ViewModel) => void;
  layout: ViewModel;
}

export default function SelectLayout({
  handleChangeLayout,
  layout,
}: SelectLayoutProps) {

  const buttons: Record<
    ViewModel,
    {
      layoutType: ViewModel;
      icon: React.ReactNode;
      rotate?: string;
    }
  > = {
    table: {
      layoutType: "table",
      icon: <BsTable size=".85rem" color="black" />,
    },
    horizontal: {
      layoutType: "horizontal",
      icon: <RiFlipHorizontalLine size="1rem" color="black" />,
      rotate: "-90deg",
    },
    "horizontal-invert": {
      layoutType: "horizontal-invert",
      icon: <RiFlipHorizontalLine size="1rem" color="black" />,
      rotate: "90deg",
    },
    vertical: {
      layoutType: "vertical",
      icon: <RiFlipHorizontalLine size="1rem" color="black" />,
      rotate: "-180deg",
    },
    "vertical-invert": {
      layoutType: "vertical-invert",
      icon: <RiFlipHorizontalLine size="1rem" color="black" />,
      rotate: "-360deg",
    },
    article: {
      layoutType: "article",
      icon: <PiArticleMediumBold size="1.2rem" color="black" />,
    },
  };

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
          <Box>Choose layout</Box>
          <ChevronDownIcon fontSize="1.25rem" />
        </Flex>
      </MenuButton>
      <MenuList bg={"#EBF0F3"} color="#2E4B6C" zIndex="2">
        {Object.values(buttons).map((element, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleChangeLayout(element.layoutType);
            }}
            bg={
              layout === element.layoutType ? "blue.100" : "transparent"
            }
            _hover={{ bg: "blue.200" }}
          >
            <Flex align="center" gap="1rem" w="inherit">
              <Box
                transform={
                  element.rotate ? `rotate(${element.rotate})` : undefined
                }
              >
                {element.icon}
              </Box>
              {capitalize(element.layoutType)}
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
