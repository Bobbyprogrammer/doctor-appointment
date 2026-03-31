import { ReactNode } from "react";

export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  render?: (value: unknown, row: T, index: number) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (value: number) => void;
  loading?: boolean;
  emptyMessage?: string;
   headerAction?: ReactNode;
}