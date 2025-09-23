import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import SearchButton from "@components/common/buttons/SearchButton";
// import { inputconteiner } from "./styles/inputTextStyle";

interface ITextFieldProps {
  label?: string;
  placeholder: string;
  type: string;
  nome: string;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  labelAbove?: boolean; 
  value?: string;
  border?: string;
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
  border,
  isMainTitleField,
  isSectionTitle
}: ITextFieldProps) {
  const isSearchField = type === "search";

  return (
    <FormControl maxW={"60vw"} mt={isSearchField ? "" : 10}>
      {label && (
        <FormLabel
          color={"#1A202C"}
          mb={labelAbove ? "0.3rem" : "0"}
          textAlign="left"
          width="100%"
          mr={"5px"}
          fontWeight={isSectionTitle ? "700" : "500"}
          fontSize={isSectionTitle ? "xl" : "lg"}
        >
          {label}
        </FormLabel>
      )}
      <Input
        borderColor={border}
        type={type}
        name={nome}
        placeholder={placeholder}
        w={isSearchField ? "250px" : "100%"}
        bgColor={"#C9D9E5"}
        borderRadius={"3px"}
        _placeholder={{ opacity: 1, color: "gray.500" }}
        focusBorderColor="#2E4B6C"
        onChange={onChange}
        value={value}
        h={isMainTitleField ? "3.5rem" : "2.5rem"}
        fontSize={isMainTitleField ? "xl" : "md"}
        fontWeight={isMainTitleField ? "600" : "400"}
      />
      {isSearchField && <SearchButton />}
    </FormControl>
  );
}
