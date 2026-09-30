import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { BsEye } from "react-icons/bs";

import React from "react";
import { capitalize } from "../../../../../shared/utils/helpers/formatters/CapitalizeText";
import { ChevronDownIcon } from "@chakra-ui/icons";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";

export type VisualizationMode = "full" | "partial" | "blocked";

interface SelectVisualizationProps {
  handleChangeVisualization: (newVisualization: VisualizationMode) => void;
  visualization: VisualizationMode;
}

export default function SelectVisualization({
  handleChangeVisualization,
  visualization,
}: SelectVisualizationProps) {   
  const window = useWindowWidth();
  const { t } = useTranslation("review/agreement");

  const buttons: Record<
    VisualizationMode,
    {
      visualizationType: VisualizationMode;
      icon: React.ReactNode;
    }
  > = {
    full: {
      visualizationType: "full",
      icon: <BsEye size="1rem" color="black" />,
    },
    partial: {
      visualizationType: "partial",
      icon: <BsEye size="1rem" color="black" />,
    },
    blocked: {
      visualizationType: "blocked",
      icon: <BsEye size="1rem" color="black" />,
    },
  };

  const activeVisualizationInfo = buttons[visualization];

  return (
    <Menu>
      <MenuButton
        as={Button}
        w={window > 1100 ? "20rem" : "15rem"}
        bg="#EBF0F3"
        color="#2E4B6C"
        fontWeight="light"
        display="flex"
      >
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Flex align="center" gap="0.75rem">
            {activeVisualizationInfo && (
              <Box>{activeVisualizationInfo.icon}</Box>
            )}
            <Box fontWeight="medium">
              {visualization
                ? capitalize(t(`visualization.${visualization}`))
                : t("visualization.choose")}
            </Box>
          </Flex>
          <ChevronDownIcon fontSize="1.25rem" />
        </Flex>
      </MenuButton>
      <MenuList bg="#EBF0F3" color="#2E4B6C" zIndex="2">
        {Object.values(buttons).map((element) => (
          <MenuItem
            key={element.visualizationType}
            onClick={() => {
              handleChangeVisualization(element.visualizationType);
            }}
            bg={
              visualization === element.visualizationType
                ? "blue.100"
                : "transparent"
            }
            _hover={{ bg: "blue.200" }}
          >
            <Flex align="center" gap="1rem" w="inherit">
              <Box>{element.icon}</Box>
              {capitalize(t(`visualization.${element.visualizationType}`))}
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}