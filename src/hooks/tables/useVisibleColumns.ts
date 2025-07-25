import { useState } from "react";

export interface ColumnVisibility {
  title: boolean;
  year: boolean;
  journal: boolean;
  authors: boolean;
}
  

export const useVisibleColumns = () => {
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    title: true,
    authors: true,
    journal: true,
    year: true,
  });

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return { visibleColumns, toggleColumn };
};
