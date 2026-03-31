"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Props {
  medicine: Medicine;
  index: number;
  onChange: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

export default function MedicineInput({
  medicine,
  index,
  onChange,
  onRemove,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Medicine #{index + 1}</h4>
        <Button
          size="icon"
          variant="destructive"
          onClick={() => onRemove(index)}
        >
          <Trash size={16} />
        </Button>
      </div>

      <Input
        placeholder="Medicine name"
        value={medicine.name}
        onChange={(e) => onChange(index, "name", e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-3">
        <Input
          placeholder="Dosage (e.g. 500mg)"
          value={medicine.dosage}
          onChange={(e) => onChange(index, "dosage", e.target.value)}
        />

        <Input
          placeholder="Frequency (e.g. twice daily)"
          value={medicine.frequency}
          onChange={(e) => onChange(index, "frequency", e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <Input
          placeholder="Duration (e.g. 5 days)"
          value={medicine.duration}
          onChange={(e) => onChange(index, "duration", e.target.value)}
        />

        <Input
          placeholder="Instructions"
          value={medicine.instructions}
          onChange={(e) => onChange(index, "instructions", e.target.value)}
        />
      </div>
    </div>
  );
}