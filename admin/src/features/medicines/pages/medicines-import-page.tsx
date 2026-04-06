"use client";

import { useState } from "react";
import { UploadCloud, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";

type ImportSummary = {
  totalRows: number;
  created: number;
  updated: number;
  skipped: number;
};

type ImportError = {
  row: number;
  message: string;
};

export default function MedicinesImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [errors, setErrors] = useState<ImportError[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const selected = acceptedFiles?.[0];
    if (!selected) return;

    const validExtensions = [".csv", ".xlsx", ".xls"];
    const isValid = validExtensions.some((ext) =>
      selected.name.toLowerCase().endsWith(ext)
    );

    if (!isValid) {
      toast.error("Only CSV, XLSX, or XLS files are allowed");
      return;
    }

    setFile(selected);
    setSummary(null);
    setErrors([]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setLoading(true);
      setSummary(null);
      setErrors([]);

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/medicines/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success(data.message || "Medicines imported successfully");
        setSummary(data.summary || null);
        setErrors(data.errors || []);
      } else {
        toast.error(data.message || "Import failed");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 shadow-xl">
        <h1 className="text-3xl font-bold text-white">Import Medicines</h1>
        <p className="mt-2 text-sm text-emerald-100">
          Upload a CSV or Excel file to import medicines into the system.
        </p>
      </div>

      {/* Upload Card */}
      <div className="rounded-3xl border border-white/10 bg-[#24303d] p-6 text-white shadow-xl">
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
            isDragActive
              ? "border-emerald-400 bg-emerald-500/10"
              : "border-white/15 hover:border-emerald-400 hover:bg-white/5"
          }`}
        >
          <input {...getInputProps()} />

          <div className="mx-auto flex w-fit items-center justify-center rounded-full bg-white/10 p-4">
            <UploadCloud className="h-10 w-10 text-emerald-400" />
          </div>

          <h3 className="mt-4 text-xl font-semibold">
            {isDragActive ? "Drop the file here" : "Drag & drop your file here"}
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            or click to browse
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Supported formats: CSV, XLSX, XLS
          </p>
        </div>

        {/* Selected File */}
        {file && (
          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-emerald-400" />
              <div>
                <p className="font-medium text-white">{file.name}</p>
                <p className="text-xs text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={handleImport}
            disabled={!file || loading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? "Importing..." : "Import Medicines"}
          </Button>

          <Button
            variant="outline"
            className="text-black"
            onClick={() => {
              setFile(null);
              setSummary(null);
              setErrors([]);
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="rounded-3xl border border-white/10 bg-[#24303d] p-6 text-white shadow-xl">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-semibold">Import Summary</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Rows" value={summary.totalRows} />
            <StatCard label="Created" value={summary.created} />
            <StatCard label="Updated" value={summary.updated} />
            <StatCard label="Skipped" value={summary.skipped} />
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="rounded-3xl border border-red-500/20 bg-[#24303d] p-6 text-white shadow-xl">
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <h2 className="text-xl font-semibold">Import Errors</h2>
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-3">
            {errors.map((err, index) => (
              <div
                key={index}
                className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4"
              >
                <p className="font-medium text-red-300">Row {err.row}</p>
                <p className="mt-1 text-sm text-slate-300">{err.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}