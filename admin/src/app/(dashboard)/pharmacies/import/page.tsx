"use client";

import { useRef, useState, ChangeEvent } from "react";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";

interface ImportSummary {
  totalRows: number;
  created: number;
  updated: number;
  skipped: number;
}

interface ImportErrorRow {
  row: number;
  message: string;
}

interface ImportPharmaciesResponse {
  success: boolean;
  message: string;
  summary?: ImportSummary;
  errors?: ImportErrorRow[];
}

export default function ImportPharmaciesPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportPharmaciesResponse | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setResult(null);
  };

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setResult(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post<ImportPharmaciesResponse>(
        "/pharmacies/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(data);

      if (data.success) {
        toast.success(data.message || "Pharmacies imported successfully");
      } else {
        toast.error(data.message || "Import failed");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload pharmacy file";

      toast.error(message);
      setResult({
        success: false,
        message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white">Import Pharmacies</h1>
        <p className="mt-2 text-sm text-blue-100">
          Upload an Excel or CSV file to bulk import pharmacy records.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#24303d] p-6 text-white shadow-xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Upload File</h2>
          <p className="mt-1 text-sm text-slate-400">
            Supported formats: .xlsx, .xls, .csv
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={handleChooseFile}
          className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-600 bg-slate-900/60 px-6 py-12 text-center transition hover:border-slate-500 hover:bg-slate-900"
        >
          <Upload className="mb-4 h-10 w-10 text-slate-300" />
          <p className="text-lg font-medium text-white">
            Click to choose pharmacy file
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Upload your pharmacy spreadsheet for bulk import
          </p>
        </button>

        {file && (
          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-emerald-400" />
                <div>
                  <p className="font-medium text-white">{file.name}</p>
                  <p className="text-sm text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                  disabled={uploading}
                >
                  Remove
                </button>

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="rounded-3xl border border-white/10 bg-[#24303d] p-6 text-white shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            {result.success ? (
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            ) : (
              <AlertCircle className="h-7 w-7 text-red-400" />
            )}
            <div>
              <h2 className="text-xl font-semibold">Import Result</h2>
              <p className="text-sm text-slate-400">{result.message}</p>
            </div>
          </div>

          {result.summary && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Total Rows</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {result.summary.totalRows}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Created</p>
                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {result.summary.created}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Updated</p>
                <p className="mt-2 text-2xl font-bold text-blue-400">
                  {result.summary.updated}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Skipped</p>
                <p className="mt-2 text-2xl font-bold text-amber-400">
                  {result.summary.skipped}
                </p>
              </div>
            </div>
          )}

          {!!result.errors?.length && (
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Import Errors
              </h3>

              <div className="max-h-80 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900">
                {result.errors.slice(0, 100).map((item, index) => (
                  <div
                    key={`${item.row}-${index}`}
                    className="border-b border-slate-800 px-4 py-3 last:border-b-0"
                  >
                    <p className="text-sm font-medium text-red-300">
                      Row {item.row}
                    </p>
                    <p className="text-sm text-slate-300">{item.message}</p>
                  </div>
                ))}
              </div>

              {result.errors.length > 100 && (
                <p className="mt-3 text-sm text-slate-400">
                  Showing first 100 errors out of {result.errors.length}.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}