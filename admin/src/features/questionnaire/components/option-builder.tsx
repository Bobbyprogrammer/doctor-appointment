"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import type { QuestionOption } from "@/types/questionnaire";

interface OptionBuilderProps {
  options: QuestionOption[];
  onChange: (options: QuestionOption[]) => void;
}

export default function OptionBuilder({
  options,
  onChange,
}: OptionBuilderProps) {
  const addOption = () => {
    onChange([...options, { label: "", value: "" }]);
  };

  const updateOption = (
    index: number,
    key: "label" | "value",
    value: string
  ) => {
    const updated = [...options];
    updated[index][key] = value;
    onChange(updated);
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-white">Options</h4>
        <Button type="button" variant="outline" onClick={addOption}>
          <Plus className="mr-2 h-4 w-4" />
          Add Option
        </Button>
      </div>

      {options.map((option, index) => (
        <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            value={option.label}
            onChange={(e) => updateOption(index, "label", e.target.value)}
            placeholder="Option label"
            className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none"
          />
          <input
            value={option.value}
            onChange={(e) => updateOption(index, "value", e.target.value)}
            placeholder="Option value"
            className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => removeOption(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
