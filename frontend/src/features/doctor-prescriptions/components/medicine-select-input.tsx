"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";

type MedicineOption = {
  value: string;
  label: string;
  medicine: {
    _id?: string;
    id?: string;
    medicineName: string;
    genericName?: string;
    strength?: string;
    form?: string;
    indication?: string;
    adultDose?: string;
    frequency?: string;
    typicalDuration?: string;
    contraindicationsNotes?: string;
  };
};

interface MedicineRow {
  medicineId?: string | null;
  name: string;
  genericName?: string;
  strength?: string;
  form?: string;
  indication?: string;
  adultDose?: string;
  dosage: string;
  frequency: string;
  duration: string;
  contraindicationsNotes?: string;
  instructions: string;
}

interface Props {
  index: number;
  medicine: MedicineRow;
  onChange: (index: number, field: keyof MedicineRow, value: string) => void;
  onSelectMedicine: (index: number, medicine: MedicineOption["medicine"]) => void;
  onRemove: (index: number) => void;
}

export default function MedicineSelectInput({
  index,
  medicine,
  onChange,
  onSelectMedicine,
  onRemove,
}: Props) {
  const [options, setOptions] = useState<MedicineOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMedicines = async (search = "") => {
    try {
      setLoading(true);

      const { data } = await api.get("/medicines", {
        params: {
          search,
          limit: 50,
        },
      });

      const mapped: MedicineOption[] = (data?.medicines || []).map((item: any) => ({
        value: item._id || item.id,
        label: `${item.medicineName}${item.strength ? ` - ${item.strength}` : ""}${item.form ? ` (${item.form})` : ""}`,
        medicine: item,
      }));

      setOptions(mapped);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines("");
  }, []);

  const selectedOption =
    medicine.medicineId && options.length > 0
      ? options.find((opt) => opt.value === medicine.medicineId) || null
      : medicine.name
      ? {
          value: medicine.medicineId || medicine.name,
          label: `${medicine.name}${medicine.strength ? ` - ${medicine.strength}` : ""}${medicine.form ? ` (${medicine.form})` : ""}`,
          medicine: {
            _id: medicine.medicineId || undefined,
            medicineName: medicine.name,
            genericName: medicine.genericName,
            strength: medicine.strength,
            form: medicine.form,
            indication: medicine.indication,
            adultDose: medicine.adultDose,
            frequency: medicine.frequency,
            typicalDuration: medicine.duration,
            contraindicationsNotes: medicine.contraindicationsNotes,
          },
        }
      : null;

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-white">Medicine #{index + 1}</h4>
        <Button
          type="button"
          variant="destructive"
          onClick={() => onRemove(index)}
          disabled={index === 0}
        >
          Remove
        </Button>
      </div>

      {/* Searchable Select */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Select Medicine
        </label>

        <Select
          value={selectedOption}
          options={options}
          isLoading={loading}
          placeholder="Search medicine..."
          onInputChange={(value) => {
            fetchMedicines(value);
          }}
          onChange={(selected) => {
            if (selected) {
              onSelectMedicine(index, (selected as MedicineOption).medicine);
            }
          }}
          isClearable
          className="text-sm"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#0f172a",
              borderColor: "rgba(255,255,255,0.1)",
              minHeight: "48px",
              color: "white",
              boxShadow: "none",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#1e293b",
              color: "white",
              zIndex: 9999,
            }),
            singleValue: (base) => ({
              ...base,
              color: "white",
            }),
            input: (base) => ({
              ...base,
              color: "white",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? "#334155" : "#1e293b",
              color: "white",
              cursor: "pointer",
            }),
            placeholder: (base) => ({
              ...base,
              color: "#94a3b8",
            }),
          }}
        />
      </div>

      {/* Auto-filled info */}
      {(medicine.genericName ||
        medicine.strength ||
        medicine.form ||
        medicine.indication ||
        medicine.adultDose ||
        medicine.contraindicationsNotes) && (
        <div className="grid gap-3 rounded-xl border border-white/10 bg-[#1e293b] p-4 text-sm text-slate-300 md:grid-cols-2">
          <p>
            <span className="text-slate-400">Generic:</span>{" "}
            {medicine.genericName || "-"}
          </p>
          <p>
            <span className="text-slate-400">Strength:</span>{" "}
            {medicine.strength || "-"}
          </p>
          <p>
            <span className="text-slate-400">Form:</span> {medicine.form || "-"}
          </p>
          <p>
            <span className="text-slate-400">Indication:</span>{" "}
            {medicine.indication || "-"}
          </p>
          <p>
            <span className="text-slate-400">Adult Dose:</span>{" "}
            {medicine.adultDose || "-"}
          </p>
          <p>
            <span className="text-slate-400">Contraindications:</span>{" "}
            {medicine.contraindicationsNotes || "-"}
          </p>
        </div>
      )}

      {/* Editable fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Dosage"
          value={medicine.dosage}
          onChange={(e) => onChange(index, "dosage", e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400"
        />

        <input
          type="text"
          placeholder="Frequency"
          value={medicine.frequency}
          onChange={(e) => onChange(index, "frequency", e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400"
        />

        <input
          type="text"
          placeholder="Duration"
          value={medicine.duration}
          onChange={(e) => onChange(index, "duration", e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400"
        />

        <input
          type="text"
          placeholder="Instructions"
          value={medicine.instructions}
          onChange={(e) => onChange(index, "instructions", e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}