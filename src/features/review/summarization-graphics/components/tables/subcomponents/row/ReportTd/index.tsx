import { Td, Text, Tooltip, Box } from "@chakra-ui/react";
import { useExport } from "@features/review/summarization-graphics/context/ExportContext";

type StudyCellProps = {
  text: string | string[];
  maxW?: string;
  type?: "number" | "string";
};

export const ReportTd = ({ text, maxW = "500px", type = "string" }: StudyCellProps) => {
  const { isExporting } = useExport();

  const content = Array.isArray(text) ? text : [text];

  return (
    <Td
  maxW={isExporting ? "none" : maxW}
  isNumeric={type === "number"}
  verticalAlign="top"
  whiteSpace={isExporting ? "normal" : "nowrap"}
>
      {isExporting ? (
        <Box>
          {content.map((line, idx) => (
            <Text key={idx} wordBreak="break-word">
              {line}
            </Text>
          ))}
        </Box>
      ) : (
        <Tooltip label={content.join(", ")} hasArrow>
          <Text isTruncated >
            {content.join(", ")}
          </Text>
        </Tooltip>
      )}
    </Td>
  );
};
