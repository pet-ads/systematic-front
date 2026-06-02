import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import { capitalize } from "@features/shared/utils/helpers/formatters/CapitalizeText";

export function renderQuestionLabel(question: string): ReactNode {
  const formattedQuestion = capitalize(question);
  const separatorIndex = formattedQuestion.indexOf(":");

  if (separatorIndex < 0) {
    return <Box as="span">{formattedQuestion}</Box>;
  }

  const id = formattedQuestion.slice(0, separatorIndex);
  const rest = formattedQuestion.slice(separatorIndex);

  return (
    <>
      <Box as="span" fontWeight="semibold">
        {id}
      </Box>
      <Box as="span">{rest}</Box>
    </>
  );
}
