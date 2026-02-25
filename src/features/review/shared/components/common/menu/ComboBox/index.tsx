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
import useComboBoxSelection from "../../../../hooks/useComboBoxSelection";
import useToaster from "@components/feedback/Toaster";

// Types
import type { PageLayout } from "../../../structure/LayoutFactory";
import type {
  OptionProps,
  OptionType,
} from "../../../../services/useFetchAllCriteriasByArticle";
import { SelectionArticles } from "@features/review/execution-selection/services/useFetchSelectionArticles";
import { KeyedMutator } from "swr";

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
  reloadArticles: KeyedMutator<SelectionArticles>;
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
  reloadArticles,
  selectedCriteria = [], // Adicionado aqui com valor default vazio
}: IComboBoxProps) {
  const { handleIncludeItemClick, handleExcludeItemClick } =
    useComboBoxSelection({ page, reloadArticles });
  const toast = useToaster();

  const { selectionStatus, extractionStatus } = status;

  const hasInvalidStatus =
    selectionStatus == "DUPLICATED" || extractionStatus == "DUPLICATED";

  const showDuplicatedWarning = () =>
    toast({
      title: "Ação não permitida",
      description:
        "Você não pode incluir ou excluir critérios de um artigo marcado como duplicado pelo sistema.",
      status: "warning",
    });

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
      >
        {text === "Include" ? (
          <HiOutlineCheckCircle size="1.75rem" />
        ) : (
          <HiOutlineXCircle size="1.75rem" />
        )}
      </MenuButton>

      <MenuList maxH="10rem" overflowY="auto">
        {options.map((option, index) => {
          // Lógica para verificar se deve ficar em negrito
          const isHighlighted =
            page === "Extraction" && selectedCriteria.includes(option.text);

          return (
            <MenuItem key={index} maxW="25rem" overflow="auto">
              {text === "Include" ? (
                <Checkbox
                  isDisabled={isDisabled}
                  isChecked={option.isChecked}
                  onChange={(e) => {
                    if (hasInvalidStatus) {
                      showDuplicatedWarning();
                      return;
                    }

                    const newValue = e.target.checked;

                    handlerUpdateCriteriasStructure(
                      groupKey,
                      option.text,
                      newValue,
                    );

                    const updatedList = options.map((item) =>
                      item.text === option.text
                        ? { ...item, isChecked: newValue }
                        : item,
                    );

                    handleIncludeItemClick(
                      updatedList
                        .filter((data) => data.isChecked == true)
                        .map((item) => item.text),
                    );
                  }}
                >
                  <Tooltip
                    label={option.text}
                    aria-label="Full criteria"
                    p="1rem"
                    hasArrow
                  >
                    <Text
                      isTruncated
                      maxW="20rem"
                      fontWeight={isHighlighted ? "bold" : "normal"}
                      color={isHighlighted ? "black" : "inherit"}
                    >
                      {option.text}
                    </Text>
                  </Tooltip>
                </Checkbox>
              ) : text === "Exclude" ? (
                <Checkbox
                  isDisabled={isDisabled}
                  isChecked={option.isChecked}
                  onChange={(e) => {
                    if (hasInvalidStatus) {
                      showDuplicatedWarning();
                      return;
                    }

                    const newValue = e.target.checked;

                    handlerUpdateCriteriasStructure(
                      groupKey,
                      option.text,
                      newValue,
                    );

                    const updatedList = options.map((item) =>
                      item.text === option.text
                        ? { ...item, isChecked: newValue }
                        : item,
                    );

                    handleExcludeItemClick(
                      updatedList
                        .filter((data) => data.isChecked == true)
                        .map((item) => item.text),
                    );
                  }}
                >
                  <Tooltip
                    label={option.text}
                    aria-label="Full criteria"
                    p="1rem"
                    hasArrow
                  >
                    <Text
                      isTruncated
                      maxW="20rem"
                      fontWeight={isHighlighted ? "bold" : "normal"}
                      color={isHighlighted ? "black" : "inherit"}
                    >
                      {option.text}
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
