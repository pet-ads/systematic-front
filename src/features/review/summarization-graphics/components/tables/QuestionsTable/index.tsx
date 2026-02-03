import { ColumnDef, GenericExpandedTable } from "../ChartTable/GenericExpandedTable";



type QuestionRow = {
  answer: string;
  studies: string;
  total: number;
  percentage: number;
};

interface QuestionsTableProps {
  data: Record<string, number[]>;
}

export const QuestionsTable = ({ data }: QuestionsTableProps) => {
  const totalResponses = Object.values(data).reduce((sum, ids) => sum + ids.length, 0);

const rows: QuestionRow[] = Object.entries(data)
  .filter(([_, ids]) => ids.length > 0)
  .map(([answer, ids]) => ({
    answer,
    studies: ids.join(", "),
    total: ids.length,
    percentage: (ids.length / totalResponses) * 100, // número
  }));


const columns: ColumnDef<QuestionRow>[] = [
  { key: "answer", label: "Answer", width: 100, sortable: true },
  { key: "studies", label: "Studies", width: 100, sortable: true,isNumeric:true, render: (row) => row.studies },
  { key: "total", label: "Total", width: 100, isNumeric: true, sortable: true },
  { key: "percentage", label: "Percentage of Total", width: 100, isNumeric: true, sortable: true, render: (row) => row.percentage.toFixed(2) + "%" },
];


  return <GenericExpandedTable<QuestionRow> data={rows} columns={columns} />;
};
