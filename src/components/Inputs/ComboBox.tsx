import { ChevronDownIcon } from "@chakra-ui/icons";
import useComboBoxSelection from "../../hooks/useComboBoxSelection";
import {
  Button,
  Checkbox,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { PageLayout } from "../../pages/Execution/Selection/subcomponents/LayoutFactory";
import { useEffect, useState } from "react";

interface IComboBoxProps {
  text: string;
  options: string[];
  isDisabled: boolean;
  onOptionchange?: (option: string, isChecked: boolean) => void;
  page: PageLayout;
  selectedCriterias: string[]; // Alterado para string[] para evitar problemas de tipo
}

export default function ComboBox({
  text,
  options,
  isDisabled,
  onOptionchange,
  page,
  selectedCriterias,
}: IComboBoxProps) {
  const { handleIncludeItemClick, handleExcludeItemClick } =
    useComboBoxSelection({ page });

  const [type, setType] = useState<string>("");
  const [localSelectedCriterias, setLocalSelectedCriterias] = useState<string[]>(selectedCriterias);

  // Sincroniza o estado local com as props
  useEffect(() => {
    setLocalSelectedCriterias(selectedCriterias);
  }, [selectedCriterias]);

  useEffect(() => {
    if (text === "Include") setType("INCLUSION");
    else setType("EXCLUSION");
  }, [text]);

  const handleCheckboxChange = (option: string, isChecked: boolean) => {
    // Atualiza o estado local
    const updatedCriterias = isChecked
      ? [...localSelectedCriterias, option]
      : localSelectedCriterias.filter((criteria) => criteria !== option);

    setLocalSelectedCriterias(updatedCriterias);

    // Chama a função apropriada para atualizar o backend
    if (text === "Include") {
      handleIncludeItemClick(isChecked, { description: option, type });
    } else if (text === "Exclude") {
      handleExcludeItemClick(isChecked, { description: option, type });
    }

    // Chama a função onOptionchange, se existir
    onOptionchange?.(option, isChecked);
  };

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        bgColor={
          text === "Include"
            ? "#6B8E23"
            : text === "Exclude"
            ? "#8B0000"
            : text === "filter options"
            ? "#EBF0F3"
            : "#303D50"
        }
        color={text === "filter options" ? "#2E4B6C" : "#ffff"}
        borderRadius={"6px"}
        border={
          text === "Include"
            ? "2px solid #6B8E23"
            : text === "Exclude"
            ? "2px solid #8B0000"
            : text === "filter options"
            ? "2px solid #CFE2F3"
            : "#2F3E52"
        }
        as={Button}
        _hover={{
          bg:
            text === "Include"
              ? "white"
              : text === "Exclude"
              ? "white"
              : text === "filter options"
              ? "#CFE2F3"
              : "#2F3E52",
          color:
            text === "Include"
              ? "#6B8E23"
              : text === "Exclude"
              ? "#8B0000"
              : text === "filter options"
              ? "#CFE2F3"
              : "#2F3E52",
          transition: "0.2s ease-in-out",
        }}
        transition="0.2s ease-in-out"
        boxShadow="md"
        rightIcon={<ChevronDownIcon fontSize="1.5rem" />}
        w={"7.5rem"}
      >
        {text}
      </MenuButton>

      <MenuList>
        {options.map((option, index) => (
          <MenuItem key={index}>
            <Checkbox
              isChecked={localSelectedCriterias.includes(option)}
              isDisabled={isDisabled}
              onChange={(e) => handleCheckboxChange(option, e.target.checked)}
            >
              {option}
            </Checkbox>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}