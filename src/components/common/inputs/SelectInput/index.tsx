import { FormControl, Select } from "@chakra-ui/react";
import React from "react";
import { formcontrol } from "./styles";
import { capitalize } from "../../../../features/shared/utils/helpers/formatters/CapitalizeText";

interface ISelectInputProps {
  values: string[];
  names: string[];
  onSelect: (selectValue: string) => void;
  selectedValue: string | null;
  placeholder?: string;
  page: string;
}

export default function SelectInput({
  values,
  names,
  onSelect,
  selectedValue,
  placeholder,
  page,
}: ISelectInputProps) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value);
  };

  const isProtocol = page === "protocol";
  return (
    <FormControl mt={2} sx={formcontrol} w={isProtocol ? "55%" : "20rem"}>
      <Select
        bgColor={"#ffffffff"}
        color="#2E4B6C"
        placeholder={placeholder}
        value={selectedValue || ""}
        onChange={handleSelectChange}
      >
        {names.map((optionName, index) => (
          <option key={index} value={values[index]}>
            {capitalize(optionName.toString())}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
