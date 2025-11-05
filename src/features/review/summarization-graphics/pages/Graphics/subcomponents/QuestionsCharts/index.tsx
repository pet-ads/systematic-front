import { Box, Text } from "@chakra-ui/react";
import PieChart from "../../../../components/charts/PieChart";
import BarChart from "../../../../components/charts/BarChart";
import { QuestionsTable } from "../../../../components/tables/QuestionsTable";
import useFetchQuestionAnswers from "../../../../services/useFetchQuestionAnwers";
import { barchartBox } from "../../styles";
import ArticleInterface from "@features/review/shared/types/ArticleInterface";

type Props = {
  selectedQuestionId?: string;
  filteredStudies: ArticleInterface[];
  type: string;
};

type Question = {
  questionId: string;
  code: string;
  description: string;
  questionType:
  | "TEXTUAL"
  | "LABELED_SCALE"
  | "NUMBERED_SCALE"
  | "PICK_LIST"
  | "PICK_MANY";
  scales: Record<string, number> | null;
  higher: number | null;
  lower: number | null;
  options: string[] | null;
};

function parseLabel(labelStr: string) {
  const match = labelStr.match(/Label\(name:\s*(.+),\s*value:\s*(\d+)\)/);
  if (match) return { name: match[1], value: Number(match[2]) };
  return null;
}

function updateData(
  labels: (string | number)[],
  entries: [string, any[]][],
  questionType: string
) {
  if (questionType === "LABELED_SCALE") {
    return labels.map((label) => {
      const entry = entries.find(
        ([entryLabel]) => parseLabel(entryLabel)?.name === label
      );
      return entry ? entry[1].length : 0;
    });
  }
  if (questionType === "PICK_MANY") {
    const counts: Record<string, number> = {};
    entries.forEach(([entryLabel, ids]) => {
      const clean = entryLabel.replace(/[\[\]]/g, "");
      const selectedOptions = clean.split(",").map((s) => s.trim());
      selectedOptions.forEach(
        (opt) => (counts[opt] = (counts[opt] || 0) + ids.length)
      );
    });
    return labels.map((label) => counts[label] || 0);
  }
  return labels.map((label) =>
    entries.find(([entryLabel]) => entryLabel === label.toString())
      ? entries.find(([entryLabel]) => entryLabel === label.toString())![1]
        .length
      : 0
  );
}

function updateLabel(question: Question) {
  const questionType = question.questionType;
  if (questionType === "NUMBERED_SCALE") {
    const higher = question.higher ?? 0;
    const lower = question.lower ?? 0;
    return Array.from({ length: higher - lower + 1 }, (_, i) => lower + i);
  } else if (questionType === "LABELED_SCALE") {
    return Object.keys(question.scales ?? {});
  } else {
    return question.options ?? [];
  }
}

export const QuestionsCharts = ({
  selectedQuestionId,
  filteredStudies,
  type,
}: Props) => {
  const { extractionAnswers, isLoadingExtractionAnswers } =
    useFetchQuestionAnswers();

  if (isLoadingExtractionAnswers) return <Text>Loading charts...</Text>;

  const filteredAnswers = selectedQuestionId
    ? extractionAnswers.filter(
      (q) => q.question.questionId === selectedQuestionId
    )
    : extractionAnswers.length
      ? [extractionAnswers[0]]
      : [];

  if (filteredAnswers.length === 0)
    return (
      <Text fontStyle="italic" color="gray.500">
        No data available for selected question.
      </Text>
    );

  const filteredStudyIds = new Set(filteredStudies.map((s) => s.studyReviewId));

  return (
    <>
      {filteredAnswers.map((q) => {
        const question = q.question;
        const code = question.code;
        const description = question.description;

const filteredEntries = Object.entries(q.answer ?? {}).map(([label, ids]) => {
  const idsArray = Array.isArray(ids) ? ids : [];
  const filteredIds = idsArray
    .map((id) => Number(id)) // 🔹 converte tudo para número
    .filter((id) => filteredStudyIds.has(id));
  return [label, filteredIds] as [string, number[]];
});

const filteredAnswer: Record<string, number[]> = Object.fromEntries(filteredEntries);



        const labels = updateLabel(question);
        const data = updateData(labels, filteredEntries, question.questionType);

        let chartContent = null;

        if (type === "Pie Chart") {
          chartContent = (
            <PieChart title={`Question ${code}`} labels={labels} data={data} />
          );
        } else if (type === "Bar Chart") {
          chartContent = (
            <BarChart
              title={`Question ${code}`}
              labels={labels}
              data={data}
              section="questions"
            />
          );
        } else {

          chartContent = <QuestionsTable data={filteredAnswer} />;
        }

        return (
          <Box
            key={question.questionId}
            sx={type === "Bar Chart" ? barchartBox : undefined}
          >
            <Text mb={2} fontWeight="bold">
              {description}
            </Text>
            {chartContent}
          </Box>
        );
      })}
    </>
  );
};
