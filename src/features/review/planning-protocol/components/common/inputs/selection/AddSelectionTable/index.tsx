import { FormControl, FormLabel } from "@chakra-ui/react";
import SelectInput from "../../../../../../../../components/common/inputs/SelectInput";

import EventButton from "@components/common/buttons/EventButton";
import { useSelect } from "../../../../../services/useSelect";
import { conteiner, formcontrol } from "./styles";
import SelectInfosTable from "@features/review/planning-protocol/pages/StepThree/subcomponents/tables/SelectInfosTable";

interface AddSelectTableProps {
  options: string[];
  placeholder: string;
  typeField: string;
  label: string;
}

export default function AddSelectTable({
  options,
  label,
  placeholder,
}: AddSelectTableProps) {
  const {
    selectedValue,
    selectedValues,
    handleSelectChange,
    handleSelectAddButtonClick,
    handleDeleteSelect,
  } = useSelect([], label);

  return (
    <FormControl sx={conteiner} alignContent={"center"}>
      <FormLabel>{label}</FormLabel>
      <FormControl sx={formcontrol} justifyContent="space-between">
        <SelectInput
          values={options}
          names={options}
          onSelect={handleSelectChange}
          selectedValue={selectedValue}
          placeholder={placeholder}
          page={"protocol"}
        />
        
      </FormControl>
        <EventButton text="Add" event={handleSelectAddButtonClick} w={"2%"} />
      <SelectInfosTable 
        selectedItems={selectedValues}
        onDeleteItem={handleDeleteSelect}
      />
    </FormControl>
  );
}
