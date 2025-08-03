import { FormControl } from "@chakra-ui/react";

import EventButton from "@components/common/buttons/EventButton";
import { useState } from "react";
import { formcontrol } from "@features/review/planning-protocol/components/common/inputs/text/AddTextField/styles";
import TextAreaInput from "@components/common/inputs/InputTextArea";
import useToaster from "@components/feedback/Toaster";

interface IAddTextFieldProps {
  onAddText: (newKeyword: string) => void;
  text: string;
}

export default function AddPickListField({
  onAddText,
  text,
}: IAddTextFieldProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const toast = useToaster();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddText = () => {
    if (inputValue.trim() !== "") {
      onAddText(inputValue.trim());
      setInputValue("");
    } else {
      toast({
        title: "Empty Field",
        description: "The field must be filled!",
        status: "warning",
        duration: "low"
      });
    }
  };

  return (
    <FormControl sx={formcontrol}>
      <TextAreaInput
        value={inputValue}
        label=""
        placeholder={text}
        onChange={handleInputChange}
      ></TextAreaInput>
      <EventButton event={handleAddText} text="ADD" mt={2} w={"10%"} />
    </FormControl>
  );
}
