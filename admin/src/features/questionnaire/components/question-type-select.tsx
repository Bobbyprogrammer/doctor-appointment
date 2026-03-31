"use client";

import type { QuestionType } from "@/types/questionnaire";

interface QuestionTypeSelectProps {
  value: QuestionType;
  onChange: (value: QuestionType) => void;
}

const questionTypes: { label: string; value: QuestionType }[] = [
  { label: "Short Text", value: "short_text" },
  { label: "Long Text", value: "long_text" },
  { label: "Single Select", value: "single_select" },
  { label: "Multi Select", value: "multi_select" },
  { label: "Yes / No", value: "yes_no" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
];

export default function QuestionTypeSelect({
  value,
  onChange,
}: QuestionTypeSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as QuestionType)}
      className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none"
    >
      {questionTypes.map((type) => (
        <option key={type.value} value={type.value} className="text-black">
          {type.label}
        </option>
      ))}
    </select>
  );
}