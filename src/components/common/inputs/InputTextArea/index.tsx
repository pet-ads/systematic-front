import { FormControl, FormLabel, Textarea } from "@chakra-ui/react";

interface ITextInputProps {
  label: string;
  placeholder: string;
  value: string | null;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  mt?: number;
  w?: string;
  variant?: string;
  isSectionTitle?: boolean;
}

export default function TextAreaInput({
  label,
  placeholder,
  onChange,
  value,
  isSectionTitle,
  ...textareaProps
}: ITextInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) onChange(e);
  };

  const normalizedValue = value ?? "";

  return (
    <FormControl maxW={"60vw"}>
      <FormLabel
        fontWeight={isSectionTitle ? 700 : 500}
        fontSize={isSectionTitle ? "xl" : "lg"}
      >
        {label}
      </FormLabel>
      <Textarea
        border="2px solid"
        borderColor="gray.300"
        bgColor={"#ffffffff"}
        _placeholder={{ opacity: 1, color: "gray.500" }}
        focusBorderColor="#2E4B6C"
        placeholder={placeholder}
        onChange={handleChange}
        value={normalizedValue}
        {...textareaProps}
      />
    </FormControl>
  );
}
