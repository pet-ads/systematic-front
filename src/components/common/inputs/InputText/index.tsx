// External library
import { FormControl, FormLabel, Input } from "@chakra-ui/react";

// Types
interface ITextFieldProps {
  label?: string;
  placeholder: string;
  type: string;
  nome: string;
  onChange?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  labelAbove?: boolean;
  value?: string;
  isDisabled?: boolean;
  isMainTitleField?: boolean;
  isSectionTitle?: boolean;
}

export default function InputText({
  label,
  placeholder,
  type,
  nome,
  onChange,
  labelAbove,
  value,
  isDisabled,
  isMainTitleField,
  isSectionTitle,
}: ITextFieldProps) {
  const isSearchField = type === "search";

  return (
    <FormControl maxW={"60vw"} mt={isSearchField ? "" : 10}>
      {label && (
        <FormLabel
          mb={labelAbove ? "0.3rem" : "0"}
          fontWeight={isSectionTitle ? 700 : 500}
          fontSize={isSectionTitle ? "xl" : "lg"}
        >
          {label}
        </FormLabel>
      )}
      <Input
        type={type}
        name={nome}
        placeholder={placeholder}
        w={isSearchField ? "250px" : "100%"}
        bgColor={"#ffffffff"}
        borderRadius={"6px"}
        border="2px solid"
        borderColor="gray.300"
        _placeholder={{ opacity: 1, color: "gray.500" }}
        focusBorderColor="#2E4B6C"
        onChange={onChange}
        value={value}
        isDisabled={isDisabled}
        h={isMainTitleField ? "3.5rem" : "2.5rem"}
        fontSize={isMainTitleField ? "lg" : "md"}
        fontWeight={isMainTitleField ? "600" : "400"}
      />
    </FormControl>
  );
}
