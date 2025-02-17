import { FormControl, FormLabel, Textarea } from "@chakra-ui/react";
import { responseArea } from "./textual";
import React, { useState } from "react";
import { capitalize } from "../../../../../../../utils/CapitalizeText";
import { container, label } from "../styles";

interface TextualResponseProps {
  question: string;
  onResponse: (response: string) => void;
}

export default function TextualResponse({ question, onResponse }: TextualResponseProps) {
  const [response, setResponse] = useState<string>("");

  console.log("resposta do textual", response);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setResponse(value);
    onResponse(value);
  }

  return (
    <FormControl sx={container}>
      <FormLabel sx={label}>{capitalize(question)}</FormLabel>
      <Textarea
        value={response}
        onChange={handleChange}
        sx={responseArea}
        _placeholder={{ opacity: 1, color: "gray.500" }}
        placeholder="Your response"
        focusBorderColor="#2E4B6C"
      />
    </FormControl>
  );
}
