import { FormControl, FormLabel, Input } from "@chakra-ui/react";
// import { inputconteiner } from "./styles/inputTextStyle";

interface ITextFieldProps {
  label?: string;
  placeholder: string;
  type: string;
  nome: string;
  onChange?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  labelAbove?: boolean; 
  value?: string;
}

export default function InputText({ label, placeholder, type, nome, onChange, labelAbove, value }: ITextFieldProps) {
  const isSearchField = type === "search";

  return (
    <FormControl maxW={"60vw"} mt={isSearchField ? "" : 10}>
      <FormControl>
        {label && (
          <FormLabel
            mb={labelAbove ? "0.3rem" : "0"}  
            fontWeight={500} 
            fontSize={"large"}
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
          borderRadius={"3px"}
          border="2px solid" 
          borderColor="gray.300"
          _placeholder={{ opacity: 1, color: "gray.500" }}
          focusBorderColor="#2E4B6C"
          onChange={onChange}
          value={value}
        />
        {/* {isSearchField && <SearchButton />} */}
      </FormControl>
    </FormControl>
  );
}
