// External library
import { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

// Utils
import { capitalize } from "@features/shared/utils/helpers/formatters/CapitalizeText";

// Styles
import { container, label } from "../styles";

// Types
interface MultiSelectionListProps {
  question: string;
  options: string[];
  answer: string[];
  isInvalid?: boolean;
  onResponse: (response: string[]) => void;
}

export default function MultiSelectionList({
  question,
  options,
  answer,
  isInvalid = false,
  onResponse,
}: MultiSelectionListProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!answer) return;
    setSelected(answer);
  }, [answer]);

  const handleChange = (values: (string | number)[]) => {
    const next = values.map(String);
    setSelected(next);
    onResponse(next);
  };

  return (
    <FormControl sx={container} isInvalid={isInvalid}>
      <FormLabel sx={label}>{capitalize(question)}</FormLabel>
      <CheckboxGroup value={selected} onChange={handleChange}>
        <Box
          display="flex"
          flexDirection="column"
          gap="1rem"
          overflowY="auto"
          maxH="8rem"
          padding="0.25rem"
        >
          {options.map((value) => (
            <Checkbox
              key={value}
              value={value}
              isChecked={selected.includes(value)}
              isInvalid={isInvalid}
            >
              {value}
            </Checkbox>
          ))}
        </Box>
      </CheckboxGroup>
    </FormControl>
  );
}
