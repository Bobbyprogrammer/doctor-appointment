"use client";

import { Upload, FileText, X } from "lucide-react";
import { useMemo } from "react";

interface ConsultationFileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export default function ConsultationFileUpload({
  files,
  onChange,
}: ConsultationFileUploadProps) {
  const fileNames = useMemo(() => files.map((file) => file.name), [files]);

  const handleAddFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    onChange([...files, ...selectedFiles]);
  };

  

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Supporting Files</h2>
        <p className="mt-2 text-sm ">
          Upload any relevant medical reports or documents if required.
        </p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center transition ">
        <Upload className="mb-3 h-7 w-7 text-white" />
        <span className="font-medium">Upload files</span>
        <span className="mt-1 text-sm ">
          PDF, DOC, DOCX, JPG, PNG
        </span>
        <input type="file" multiple className="hidden" onChange={handleAddFiles} />
      </label>

      {files.length > 0 && (
        <div className="space-y-3">
          {fileNames.map((name, index) => (
            <div
              key={`${name}-${index}`}
              className="flex items-center justify-between rounded-xl border bg-background px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm">{name}</span>
              </div>

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}