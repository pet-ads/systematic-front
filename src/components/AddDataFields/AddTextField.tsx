import { FormControl } from "@chakra-ui/react";
import TextAreaInput from "../Inputs/InputTextArea";
import EventButton from "../Buttons/EventButton";
import { useState } from "react";

interface IAddTextFieldProps {
  onAddText: (newKeyword: string) => void;
  text: string;
}

export default function AddTextField({ onAddText, text }: IAddTextFieldProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddText = () => {
    if (inputValue.trim() !== "") {
      onAddText(inputValue.trim());
      setInputValue("");
    } else {
      window.alert("The field must be filled!");
    }
  };

  return (
    <FormControl rowGap={5} display={"flex"} flexDir={"column"}>
      <TextAreaInput label="" placeholder={text} onChange={handleInputChange}></TextAreaInput>
      <EventButton event={handleAddText} text="ADD" />
    </FormControl>
  );
}