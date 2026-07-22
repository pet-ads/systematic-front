import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";
import { ColumnDef, GenericExpandedTable } from "../ChartTable/GenericExpandedTable";
import { useTranslation } from "react-i18next";

type QuestionRow = {
  answer: string;
  studies: string;
  total: number;
  percentage: number;
};

interface QuestionsTableProps {
  data: Record<string, number[]>;
  columnsVisible: ColumnVisibility;
}

export const QuestionsTable = ({ data, columnsVisible }: QuestionsTableProps) => {
  const { t } = useTranslation("review/summarization-graphics");

  const totalResponses = Object.values(data).reduce((sum, ids) => sum + ids.length, 0);

  const rows: QuestionRow[] = Object.entries(data)
    .filter(([_, ids]) => ids.length > 0)
    .map(([answer, ids]) => ({
      answer,
      studies: ids.join(", "),
      total: ids.length,
      percentage: (ids.length / totalResponses) * 100, 
    }));

  const columns: ColumnDef<QuestionRow>[] = [
    { key: "answer", label: t("questionsTable.answer"), width: "65%", sortable: true },
    { key: "studies", label: t("questionsTable.studies"), width: "15%", sortable: true, isNumeric: true, render: (row) => row.studies },
    { key: "total", label: t("questionsTable.total"), width: "10%", isNumeric: true, sortable: true },
    { key: "percentage", label: t("questionsTable.percentage"), width: "20%", isNumeric: true, sortable: true, render: (row) => row.percentage.toFixed(2) + "%" },
  ];

  const visibleColumns = columns.filter((column) => {
    const visibilityKey =
      column.key === "total"
        ? "totalAnswers"
        : column.key === "percentage"
        ? "percentageOfTotal"
        : column.key;

    return columnsVisible[visibilityKey as keyof ColumnVisibility] === true;
  });

  return <GenericExpandedTable<QuestionRow> data={rows} columns={visibleColumns} />;
};
