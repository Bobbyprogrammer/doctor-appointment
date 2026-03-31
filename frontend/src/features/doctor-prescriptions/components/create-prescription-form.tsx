"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import MedicineInput from "./medicine-input";

interface Props {
  consultationId: string;
  onSuccess?: () => void;
}

export default function CreatePrescriptionForm({
  consultationId,
  onSuccess,
}: Props) {
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [medicines, setMedicines] = useState([
    {
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  ]);

  const handleMedicineChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...medicines];
    updated[index][field as keyof (typeof updated)[0]] = value;
    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("consultationId", consultationId);
      formData.append("diagnosis", diagnosis);
      formData.append("notes", notes);
      formData.append("medicines", JSON.stringify(medicines));

      files.forEach((file) => {
        formData.append("files", file);
      });

      const { data } = await api.post("/prescriptions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Prescription created successfully");

        setDiagnosis("");
        setNotes("");
        setFiles([]);
        setMedicines([
          {
            name: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
          },
        ]);

        onSuccess?.();
      } else {
        toast.error(data.message || "Failed to create prescription");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create prescription"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Textarea
        placeholder="Diagnosis"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        className="min-h-[110px] border-white/10 bg-white/5 text-white placeholder:text-slate-400"
      />

      <Textarea
        placeholder="Doctor notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[110px] border-white/10 bg-white/5 text-white placeholder:text-slate-400"
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Medicines</h3>
          <Button type="button" variant="outline" className="text-black cursor-pointer" onClick={addMedicine}>
            + Add Medicine
          </Button>
        </div>

        {medicines.map((medicine, index) => (
          <MedicineInput
            key={index}
            index={index}
            medicine={medicine}
            onChange={handleMedicineChange}
            onRemove={removeMedicine}
          />
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Attach Files</label>
        <input
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setFiles(Array.from(e.target.files));
            }
          }}
          className="block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Create Prescription"}
      </Button>
    </div>
  );
}