import { useState } from "react";

export interface ColumnVisibility {
  title: boolean;
  year: boolean;
  journal: boolean;
  authors: boolean;
  score: boolean;
  selectionStatus: boolean;
  extractionStatus: true;
  priority: boolean;
}
  
export const useVisibleColumns = () => {
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    title: true,
    authors: true,
    journal: true,
    year: true,
    score: true,
    selectionStatus: true,
    extractionStatus: true,
    priority: true,
  });

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return { visibleColumns, toggleColumn };
};
