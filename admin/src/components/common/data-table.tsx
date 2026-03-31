"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DataTableProps } from "@/types/table";

const DataTable = <T,>({
  title,
  columns,
  data,
  totalRecords,
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
  emptyMessage = "No records found.",
   headerAction,
}: DataTableProps<T>) => {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-[#24303d] shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
           {headerAction ? <div>{headerAction}</div> : null}
          <div className="inline-flex w-fit items-center rounded-full bg-blue-500/15 px-3 py-1 text-sm font-medium text-blue-200">
          
            {totalRecords} records
          </div>
        </div>
         
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#1f2a36]">
              {columns.map((column, index) => (
                <th
                  key={`${String(column.key)}-${index}`}
                  className={`border-b border-white/10 px-4 py-4 text-left text-sm font-semibold text-white first:rounded-tl-2xl last:rounded-tr-2xl ${column.className || ""}`}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-slate-300"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={String((row as { _id?: string; id?: string })._id || (row as { _id?: string; id?: string }).id || rowIndex)}
                  className="transition-colors hover:bg-white/5"
                >
                  {columns.map((column, colIndex) => {
                    const value = row[column.key as keyof T];

                    return (
                      <td
                        key={`${String(column.key)}-${colIndex}`}
                        className={`border-b border-white/10 px-4 py-4 text-sm text-slate-200 ${column.className || ""}`}
                      >
                        {column.render
                          ? column.render(value, row, rowIndex)
                          : String(value ?? "-")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span>Rows per page</span>

          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
            className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size} className="bg-[#24303d]">
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-4 md:justify-end">
          <p className="text-sm text-slate-300">
            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(1)}
              disabled={!canGoPrevious}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!canGoPrevious}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canGoNext}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(totalPages)}
              disabled={!canGoNext}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;