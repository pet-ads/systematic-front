import { Box, FormControl, FormLabel } from "@chakra-ui/react";
import TextAreaInput from "../../../../../../../../components/common/inputs/InputTextArea";
import EventButton from "@components/common/buttons/EventButton";
import { useState } from "react";
import { formcontrol } from "./styles";
import { capitalize } from "../../../../../../../shared/utils/helpers/formatters/CapitalizeText";
import useToaster from "@components/feedback/Toaster";

interface IAddTextFieldProps {
  onAddText: (newKeyword: string) => void;
  text: string;
  label: string;
}

export default function AddTextField({
  onAddText,
  text,
  label,
}: IAddTextFieldProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const toast = useToaster();

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
      });
    }
  };

  return (
    <FormControl sx={formcontrol} mt="3rem">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormLabel>{label}</FormLabel>
      </Box>
      <TextAreaInput
        value={inputValue}
        label=""
        placeholder={text}
        onChange={handleInputChange}
      />
      <EventButton event={handleAddText} text={capitalize("add")} w={"2%"} />
    </FormControl>
  );
}
