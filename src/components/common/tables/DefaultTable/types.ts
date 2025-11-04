
import React from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface GenericTableProps<T> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  enableSorting?: boolean; 
}

export type SortConfig<T> = {
  key: keyof T;
  direction: "asc" | "desc";
} | null;

