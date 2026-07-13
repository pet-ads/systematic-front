import { FormControl, FormLabel, Textarea } from "@chakra-ui/react";

interface ITextInputProps {
  label: string;
  placeholder: string;
  value: string | null;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  mt?: number;
  w?: string;
  variant?: string;
}

export default function TextAreaInput({ 
  label, 
  placeholder, 
  onChange, 
  value, 
  w = "100%", 
  ...textareaProps 
}: ITextInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  const normalizedValue = value ?? "";

  return (
    <FormControl w={w}>
      <FormLabel mt={"30px"} fontWeight={500} fontSize={"large"}>
        {label}
      </FormLabel>
      <Textarea 
        w="100%"
        border="2px solid" 
        borderColor="gray.300" 
        bgColor={"#ffffff"} 
        _placeholder={{ opacity: 1, color: 'gray.500' }}
        focusBorderColor="#2E4B6C" 
        placeholder={placeholder} 
        onChange={handleChange}
        value={normalizedValue}
        {...textareaProps} 
      />
    </FormControl>
  );
}