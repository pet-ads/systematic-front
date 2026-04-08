// External library
import { useEffect, useState } from "react";
import { FormControl, FormLabel } from "@chakra-ui/react";

// Components
import SelectInput from "@components/common/inputs/SelectInput";

// Utils
import { capitalize } from "@features/shared/utils/helpers/formatters/CapitalizeText";

// Styles
import { container, label } from "../styles";

// Types
interface LabeledListProps {
  question: string;
  scales: Record<string, number>;
  answer: string | { name: string; value: number } | null;
  isInvalid?: boolean;
  onResponse: (response: { name: string; value: number }) => void;
}

export default function LabeledList({
  question,
  scales,
  answer,
  isInvalid = false,
  onResponse,
}: LabeledListProps) {
  const [selected, setSelected] = useState("");

  const options = Object.entries(scales).map(
    ([key, value]) => `${key}: ${value}`,
  );

  const handleSelectChange = (value: string) => {
    setSelected(value);
    const [labelKey, num] = value.split(":");
    onResponse({ name: labelKey.trim(), value: parseInt(num.trim()) });
  };

  useEffect(() => {
    if (!answer) return;

    if (typeof answer === "string") {
      setSelected(answer);
      return;
    }

    const formattedAnswer = `${answer.name}: ${answer.value}`;
    setSelected(formattedAnswer);
  }, [answer]);

  return (
    <FormControl sx={container} isInvalid={isInvalid}>
      <FormLabel sx={label}>{capitalize(question)}</FormLabel>
      <SelectInput
        names={options}
        values={options}
        onSelect={handleSelectChange}
        selectedValue={selected}
        page="extraction"
        placeholder="Labels"
        isInvalid={isInvalid}
      />
    </FormControl>
  );
}
