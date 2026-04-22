import { FormControl, FormLabel } from "@chakra-ui/react";
import SelectInput from "../../../../../../../../components/common/inputs/SelectInput";
import { capitalize } from "@features/shared/utils/helpers/formatters/CapitalizeText";

import EventButton from "@components/common/buttons/EventButton";
import { useSelect } from "../../../../../services/useSelect";
import { conteiner, formcontrol } from "./styles";
import SelectInfosTable from "@features/review/planning-protocol/components/common/tables/SelectInfosTable";

interface AddSelectTableProps {
  options: string[];
  placeholder: string;
  typeField?: string;
  label: string;
  stateKey: string; // <-- Prop para garantir que o useSelect use a chave certa
}

export default function AddSelectionTable({
  options,
  label,
  placeholder,
  stateKey,
}: AddSelectTableProps) {
  // Passamos o stateKey (string exata da dev) no lugar do label traduzido
  const {
    selectedValue,
    selectedValues,
    handleSelectChange,
    handleSelectAddButtonClick,
    handleDeleteSelect,
  } = useSelect([], stateKey);

  const formattedOptions = options.map((opt) => capitalize(opt.toLowerCase()));

  const formatSelectedValues = selectedValues.map((value) =>
    capitalize(value.toLowerCase()),
  );

  return (
    <FormControl sx={conteiner} alignContent={"center"}>
      <FormLabel mt={"30px"} fontWeight={500} fontSize={"large"}>
        {label}
      </FormLabel>
      <FormControl sx={formcontrol} justifyContent={"space-between"}>
        <SelectInput
          values={formattedOptions}
          names={options}
          onSelect={handleSelectChange}
          selectedValue={selectedValue}
          placeholder={placeholder}
          page={"protocol"}
        />
        <EventButton
          text="Add"
          event={() => {
            if (selectedValue && selectedValue.trim() !== "") {
              handleSelectAddButtonClick();
            }
          }}
          w={"2%"}
          mr={"17px"}
        />
      </FormControl>

      <SelectInfosTable
        selectedItems={formatSelectedValues}
        onDeleteItem={handleDeleteSelect}
      />
    </FormControl>
  );
}
