import { SetStateAction, useState } from "react";

export interface Row {
  isNew: boolean;
  id: number | string;
  questionId: string | null;
  question: string;
  type: string;
  questions: string[];
  higher: number;
  lower: number;
  scale: Record<string, number>;
}

export function useInteractiveTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const options = ["", "Textual", "Pick list", "Number scale", "Labeled List", "Pick many"];
  const headers = ["Id", "Question", "Type", ""];

  const addRow = (setEditIndex: React.Dispatch<SetStateAction<number | null>>, setQuestions: React.Dispatch<SetStateAction<string[]>>) => {
      setRows([...rows, { scale: {}, higher: 5, lower: 0, questions: [], isNew: true, questionId: null, id: rows.length + 1, question: "", type: "" }]);
      setQuestions([]);
      setEditIndex(rows.length);
    };

  const handleDelete = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index].question = value;
    setRows(updatedRows);
  };

  const handleTypeChange = (index: number, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index].type = value;
    setRows(updatedRows);
  };

  const handleServerSend = (index: number, id: string) => {
    const updatedRows = [...rows];
    updatedRows[index].questionId = id;
    setRows(updatedRows);
  }

  const handleAddQuestions = (index: number, value: string[]) => {
    const updatedRows = [...rows];
    updatedRows[index].questions = value;
    setRows(updatedRows);
  }

  const handleNumberScale = (index: number, lower: number, higher: number) => {
    const updatedRows = [...rows];
    console.log(updatedRows[index].questionId);
    updatedRows[index].lower = lower;
    updatedRows[index].higher = higher;
    setRows(updatedRows);
  }

  const handleLabeledList = (index: number, scale: Record<string, number>) => {
    const updatedRows = [...rows];
    updatedRows[index].scale = scale;
    setRows(updatedRows);
  }

  const handlePickMany = (index: number, value: string[]) => {
    const updatedRows = [...rows];
    updatedRows[index].questions = value;
    setRows(updatedRows);
  };

  const getRowsData = () => {
    return rows;
  };

  return {
    setRows,
    rows,
    addRow,
    handleServerSend,
    handleNumberScale,
    handleDelete,
    handleQuestionChange,
    handleTypeChange,
    handleLabeledList,
    handlePickMany,
    handleAddQuestions,
    options,
    headers,
    getRowsData,
  };
}
