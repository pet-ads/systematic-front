// External library
import { useState } from "react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

// Components
import SelectInput from "@components/common/inputs/SelectInput";

// Utils
import { renderQuestionLabel } from "../helpers";

// Styles
import { container, label } from "../styles";

// Types
interface DropdownListProps {
  question: string;
  options: string[];
  answer: string;
  isInvalid?: boolean;
  onResponse: (response: string) => void;
}

export default function DropdownList({
  question,
  options,
  answer,
  isInvalid = false,
  onResponse,
}: DropdownListProps) {
  const [selected, setSelected] = useState(answer);
  const { t } = useTranslation("review/execution-extraction");
  
  const handleSelectChange = (value: string) => {
    setSelected(value);
    onResponse(value);
  };

  return (
    <FormControl sx={container} isInvalid={isInvalid}>
      <FormLabel sx={label}>{renderQuestionLabel(question)}</FormLabel>
      <SelectInput
        names={[...options]}
        values={[...options]}
        onSelect={handleSelectChange}
        selectedValue={selected}
        page="extraction"
        placeholder={t("extractionForm.dropdownList")}
        isInvalid={isInvalid}
      />
    </FormControl>
  );
}
