// External libraries
import {
  Button,
  Checkbox,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

// Hooks
import useToaster from "@components/feedback/Toaster";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";

// Types
import type { PageLayout } from "../../../structure/LayoutFactory";
import type {
  OptionProps,
  OptionType,
} from "../../../../services/useFetchAllCriteriasByArticle";

interface IComboBoxProps {
  text: string;
  options: OptionProps[];
  isDisabled: boolean;
  onOptionchange?: (option: string, isChecked: boolean) => void;
  status: {
    selectionStatus: string;
    extractionStatus: string;
  };
  page: PageLayout;
  groupKey: OptionType;
  handlerUpdateCriteriasStructure: (
    key: OptionType,
    optionText: string,
    newValue: boolean,
  ) => void;
  selectedCriteria?: string[];
}

export default function ComboBox({
  text,
  options,
  isDisabled,
  onOptionchange,
  page,
  status,
  groupKey,
  handlerUpdateCriteriasStructure,
  selectedCriteria = [],
}: IComboBoxProps) {
  const windowWidth = useWindowWidth();

  const isCompactDesktop =
  windowWidth <= 1300 && windowWidth >= 1000;

  const iconSize = isCompactDesktop ? "1.35rem" : "1.75rem";
  const buttonPadding = isCompactDesktop ? ".75rem" : "1rem";
  
  const toast = useToaster();

  const { selectionStatus, extractionStatus } = status;

  const hasInvalidStatus =
    (selectionStatus == "DUPLICATED" && page === "Selection") || (extractionStatus == "DUPLICATED" && page === "Extraction");

  const showDuplicatedWarning = () =>
    toast({
      title: "Action not allowed",
      description:
        "You cannot include or exclude criteria for an article marked as duplicated by the system.",
      status: "warning",
    });

  const handleToggle = (option: OptionProps, newValue: boolean) => {
    if (hasInvalidStatus) {
      showDuplicatedWarning();
      return;
    }
    handlerUpdateCriteriasStructure(groupKey, option.text, newValue);
  };

  const isInclusionGroup = groupKey === "INCLUSION";
  const isExclusionGroup = groupKey === "EXCLUSION";
  const codePrefix = isInclusionGroup ? "IC" : "EC";

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="white"
        color="black"
        isDisabled={isDisabled}
        p={buttonPadding}
        minW="unset"
      >
        {isInclusionGroup ? (
          <HiOutlineCheckCircle size={iconSize} />
        ) : (
          <HiOutlineXCircle size={iconSize} />
        )}
      </MenuButton>

      <MenuList maxH="10rem" overflowY="auto">
        {options.map((option, index) => {
          const isHighlighted =
            page === "Extraction" && selectedCriteria.includes(option.text);

            const hasColon = option.text.includes(":");
            const code = hasColon ? option.text.substring(0, option.text.indexOf(":")).trim() : null;
            const desc = hasColon ? option.text.substring(option.text.indexOf(":") + 1).trim() : option.text;

          return (
            <MenuItem key={index} maxW="25rem" overflow="auto">
              {isInclusionGroup || isExclusionGroup ? (
                <Checkbox
                  isDisabled={isDisabled}
                  isChecked={option.isChecked}
                  onChange={(e) => handleToggle(option, e.target.checked)}
                >
                  <Tooltip
                    label={desc}
                    aria-label="Full criteria"
                    p="1rem"
                    hasArrow
                  >
                    <Text
                      isTruncated
                      maxW={isCompactDesktop ? "14rem" : "20rem"}
                      fontSize={isCompactDesktop ? "sm" : "md"}
                      fontWeight={isHighlighted ? "bold" : "normal"}
                      color={isHighlighted ? "black" : "inherit"}
                    >
                      {code || `${codePrefix}-${(index + 1).toString().padStart(2, "0")}`}
                    </Text>
                  </Tooltip>
                </Checkbox>
              ) : text === "filter options" && onOptionchange ? (
                <Checkbox
                  isDisabled={isDisabled}
                  onChange={(e) =>
                    onOptionchange?.(option.text, e.target.checked)
                  }
                >
                  <Text fontWeight={isHighlighted ? "bold" : "normal"}>
                    {option.text}
                  </Text>
                </Checkbox>
              ) : (
                <Checkbox isDisabled={isDisabled}>
                  <Text fontWeight={isHighlighted ? "bold" : "normal"}>
                    {option.text}
                  </Text>
                </Checkbox>
              )}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}