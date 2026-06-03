// External library
import React, { useState } from "react";
import { FormControl, FormLabel, Textarea } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

// Utils
import { renderQuestionLabel } from "../helpers";

// Styles
import { responseArea } from "./styles";
import { container, label } from "../styles";

// Types
interface TextualResponseProps {
  question: string;
  answer: string;
  isInvalid?: boolean;
  onResponse: (response: string) => void;
}

export default function TextualResponse({
  question,
  answer,
  isInvalid = false,
  onResponse,
}: TextualResponseProps) {
  const [response, setResponse] = useState<string>(answer);
  const { t } = useTranslation("review/execution-extraction");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setResponse(value);
    onResponse(value);
  };

  return (
    <FormControl sx={container} isInvalid={isInvalid}>
      <FormLabel sx={label}>{renderQuestionLabel(question)}</FormLabel>
      <Textarea
        value={response}
        onChange={handleChange}
        sx={responseArea}
        isInvalid={isInvalid}
        _placeholder={{ opacity: 1, color: "gray.500" }}
        placeholder={t("extractionForm.textual")}
        focusBorderColor="#2E4B6C"
      />
    </FormControl>
  );
}
