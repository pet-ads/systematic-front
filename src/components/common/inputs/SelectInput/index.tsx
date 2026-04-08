// External library
import { FormControl, Select } from "@chakra-ui/react";
import React from "react";

// Styles
import { formcontrol } from "./styles";

// Utils
import { capitalize } from "../../../../features/shared/utils/helpers/formatters/CapitalizeText";

// Types
interface ISelectInputProps {
  values: string[];
  names: string[];
  onSelect: (selectValue: string) => void;
  selectedValue: string | null;
  placeholder?: string;
  page: string;
  isInvalid?: boolean;
}

export default function SelectInput({
  values,
  names,
  onSelect,
  selectedValue,
  placeholder,
  page,
  isInvalid = false,
}: ISelectInputProps) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value);
  };

  const isProtocol = page === "protocol";

  return (
    <FormControl
      sx={formcontrol}
      w={isProtocol ? "55%" : "20rem"}
      isInvalid={isInvalid}
    >
      <Select
        bgColor="#ffffffff"
        color="#2E4B6C"
        value={selectedValue || ""}
        onChange={handleSelectChange}
        isInvalid={isInvalid}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {names.map((optionName, index) => (
          <option key={index} value={values[index]}>
            {capitalize(optionName.toString())}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
