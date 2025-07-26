import { Box, FormControl, FormLabel } from "@chakra-ui/react";
import TextAreaInput from "../Inputs/InputTextArea";
import EventButton from "../Buttons/EventButton";
import { useState } from "react";
import { formcontrol } from "./styles/AddTextFieldStyle";
import { capitalize } from "../../utils/CapitalizeText";
import { useToast } from "@chakra-ui/react";

interface IAddTextFieldProps {
  onAddText: (newKeyword: string) => void;
  text: string;
  label: string;
}

export default function AddTextField({ onAddText, text, label }: IAddTextFieldProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddText = () => {
    const normalizedAddTextValue = capitalize(inputValue.toLowerCase().trim());
    if (normalizedAddTextValue !== "") {
      onAddText(normalizedAddTextValue);
      setInputValue("");
    } else {
      toast({
        title: "Empty Field",
        description: "The field must be filled!",
        status: "warning",
        duration: 4500,
        isClosable: true,
        position: 'top'
      });
    }
  };

  return (
    <FormControl sx={formcontrol} mt="3rem">
      <FormLabel>{label}</FormLabel>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <TextAreaInput value={inputValue} label="" placeholder={text} onChange={handleInputChange}></TextAreaInput>
      </Box>
      <Box display="flex" justifyContent="center" mt={4}>
        <EventButton event={handleAddText} text="ADD" />
      </Box>
    </FormControl>
  );
}