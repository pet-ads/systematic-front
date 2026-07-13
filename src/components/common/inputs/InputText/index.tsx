// External library
import { FormControl, FormLabel, Input } from "@chakra-ui/react";

// Types
interface ITextFieldProps {
  label?: string;
  width?: string | number;
  maxWidth?: string | number;
  minWidth?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
  placeholder: string;
  type: string;
  nome: string;
  onChange?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  labelAbove?: boolean;
  value?: string;
  isDisabled?: boolean;
}

export default function InputText({
  label,
  width,
  minWidth,
  maxWidth,
  height,
  minHeight,
  maxHeight,
  placeholder,
  type,
  nome,
  onChange,
  value,
  isDisabled,
}: ITextFieldProps) {
  const isSearchField = type === "search";

  return (
    <FormControl
      width={width ? `clamp(${minWidth}, ${width}, ${maxWidth})` : "100%"}
      height={height ? `clamp(${minHeight}, ${height}, ${maxHeight})` : undefined}
    >
      <FormControl w="100%">
        {label && (
          <FormLabel fontWeight={500} fontSize="large">
            {label}
          </FormLabel>
        )}
        <Input
          type={type}
          name={nome}
          placeholder={placeholder}
          w={isSearchField ? "205px" : "100%"}
          bgColor={"#ffffff"}
          borderRadius={"3px"}
          border="2px solid"
          borderColor="gray.300"
          fontSize={isSearchField ? "medium" : "lg"}
          _placeholder={{ opacity: 1, color: "gray.500" }}
          focusBorderColor="#2E4B6C"
          onChange={onChange}
          value={value}
          isDisabled={isDisabled}
        />
      </FormControl>
    </FormControl>
  );
}