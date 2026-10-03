import { Box, Checkbox, Heading, HStack, Select, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { getAllowedVisualizations } from "../../utils/visualizationOptions";
import { ExportItemConfig, VisualizationType } from "../../services/exportReviewTypes";

type Question = { questionId: string; description: string; questionType: string };

type Props = {
  questions: Question[];
  items: ExportItemConfig[];
  onChange: (items: ExportItemConfig[]) => void;
};

export default function ExportItemsSection({ questions, items, onChange }: Props) {
  const { t } = useTranslation([
    "review/summarization-graphics",
    "review/summarization-download",
  ]);
  const findItem = (id: string) => items.find((i) => i.questionId === id);

  const toggleQuestion = (questionId: string, questionType: string) => {
    const existing = findItem(questionId);
    if (existing) {
      onChange(items.filter((i) => i.questionId !== questionId));
    } else {
      const allowed = getAllowedVisualizations(questionType, t);
      onChange([...items, { questionId, visualization: allowed[0].type }]);
    }
  };

  const changeVisualization = (questionId: string, visualization: VisualizationType) => {
    onChange(items.map((i) => (i.questionId === questionId ? { ...i, visualization } : i)));
  };

  return (
    <Box>
      <Heading size="md" mb={3}>{t("review/summarization-download:exportation")}</Heading>
      <Stack spacing={3}>
        {questions.map((q) => {
          const item = findItem(q.questionId);
          const allowed = getAllowedVisualizations(q.questionType, t);
          return (
            <HStack key={q.questionId} justify="space-between">
              <Checkbox isChecked={!!item} onChange={() => toggleQuestion(q.questionId, q.questionType)} flex="1">
                <Text noOfLines={1}>{q.description}</Text>
              </Checkbox>
              {item && (
                <Select
                  size="sm"
                  w="220px"
                  value={item.visualization}
                  onChange={(e) => changeVisualization(q.questionId, e.target.value as VisualizationType)}
                >
                  {allowed.map((opt) => (
                    <option key={opt.type} value={opt.type}>{opt.label}</option>
                  ))}
                </Select>
              )}
            </HStack>
          );
        })}
      </Stack>
    </Box>
  );
}