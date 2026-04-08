// External library
import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";

// Utils
import { capitalize } from "@features/shared/utils/helpers/formatters/CapitalizeText";

// Styles
import { container, label } from "../styles";
import {
  radiosGroup,
  radios,
  radioBox,
  clearButton,
  radiosLabel,
} from "./styles";

// Types
interface NumberScaleProps {
  answer: string;
  question: string;
  minValue: number;
  maxValue: number;
  isInvalid?: boolean;
  onResponse: (response: string) => void;
}

export default function NumberScale({
  question,
  answer,
  minValue,
  maxValue,
  isInvalid = false,
  onResponse,
}: NumberScaleProps) {
  const [checkedOption, setCheckedOption] = useState<string>(answer);

  const scaleValues = Array.from(
    { length: maxValue - minValue + 1 },
    (_, i) => minValue + i,
  );

  const handleClearSelection = () => {
    setCheckedOption("");
  };

  const handleChange = (value: string) => {
    setCheckedOption(value);
    onResponse(value);
  };

  return (
    <FormControl sx={container} isInvalid={isInvalid}>
      <FormLabel sx={label}>{capitalize(question)}</FormLabel>
      <Box display="flex" flexDirection="column" gap="1rem">
        <RadioGroup
          sx={radiosGroup}
          value={checkedOption}
          onChange={handleChange}
        >
          <Flex wrap="wrap" justifyContent="center" gap="1rem">
            {scaleValues.map((value, index) => (
              <Flex key={index} sx={radioBox}>
                <Text sx={radiosLabel}>{value}</Text>
                <Radio sx={radios} value={value.toString()} />
              </Flex>
            ))}
          </Flex>
        </RadioGroup>
        {checkedOption && (
          <Button sx={clearButton} onClick={handleClearSelection}>
            Clear selection
          </Button>
        )}
      </Box>
    </FormControl>
  );
}
