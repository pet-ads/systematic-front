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
  stateKey: string; 
  type: string;
}

export default function AddSelectionTable({
  options,
  label,
  placeholder,
  stateKey,
  type,
}: AddSelectTableProps) {
  const {
    selectedValue,
    selectedValues,
    handleSelectChange,
    handleSelectAddButtonClick,
    handleDeleteSelect,
  } = useSelect([], stateKey);

  const formattedOptions = options.map((opt) => capitalize(opt.toLowerCase()));

  const formatSelectedValues = selectedValues.map((val) => {
    const originalOption = options.find((opt) => opt.toLowerCase() === val.toLowerCase());
    return originalOption || val;
  });

  return (
    <FormControl 
      w="100%" 
      sx={{ 
        ...conteiner, 
        width: "100% !important", 
        maxWidth: "100% !important" 
      }} 
      alignContent={"center"}
    >
      <FormLabel mt={"30px"} fontWeight={500} fontSize={"large"}>
        {label}
      </FormLabel>
      
      <FormControl 
        w="100%" 
        sx={{ 
          ...formcontrol, 
          width: "100% !important", 
          maxWidth: "100% !important" 
        }} 
        justifyContent={"space-between"}
      >
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
        type={type}
      />
    </FormControl>
  );
}