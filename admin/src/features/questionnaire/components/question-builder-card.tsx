
"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import OptionBuilder from "./option-builder";
import QuestionTypeSelect from "./question-type-select";
import type { QuestionnaireQuestion, QuestionType } from "@/types/questionnaire";

interface QuestionBuilderCardProps {
  question: QuestionnaireQuestion;
  index: number;
  onChange: (index: number, question: QuestionnaireQuestion) => void;
  onRemove: (index: number) => void;
}

export default function QuestionBuilderCard({
  question,
  index,
  onChange,
  onRemove,
}: QuestionBuilderCardProps) {
  const updateField = (key: keyof QuestionnaireQuestion, value: any) => {
    onChange(index, {
      ...question,
      [key]: value,
    });
  };

  const needsOptions =
    question.type === "single_select" || question.type === "multi_select";

  return (
    <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Question #{index + 1}
        </h3>

        <Button type="button" variant="destructive" size="icon" onClick={() => onRemove(index)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={question.questionText}
          onChange={(e) => updateField("questionText", e.target.value)}
          placeholder="Question text"
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none"
        />
        <input
          value={question.questionKey}
          onChange={(e) => updateField("questionKey", e.target.value)}
          placeholder="Question key (e.g. symptom_duration)"
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <QuestionTypeSelect
          value={question.type}
          onChange={(value: QuestionType) => updateField("type", value)}
        />

        <input
          type="number"
          value={question.order}
          onChange={(e) => updateField("order", Number(e.target.value))}
          placeholder="Order"
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={question.placeholder || ""}
          onChange={(e) => updateField("placeholder", e.target.value)}
          placeholder="Placeholder"
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none"
        />
        <input
          value={question.helpText || ""}
          onChange={(e) => updateField("helpText", e.target.value)}
          placeholder="Help text"
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none"
        />
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-white">
        <input
          type="checkbox"
          checked={question.isRequired}
          onChange={(e) => updateField("isRequired", e.target.checked)}
        />
        <span>Required question</span>
      </label>

      {needsOptions && (
        <OptionBuilder
          options={question.options}
          onChange={(options) => updateField("options", options)}
        />
      )}
    </div>
  );
}