"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import MedicineSelectInput from "./medicine-select-input";

interface PharmacySnapshot {
  registrationNumber?: string;
  name?: string;
  email?: string;
  phone?: string;
  street1?: string;
  street2?: string;
  street3?: string;
  town?: string;
  county?: string;
  eircode?: string;
}

interface CreatedPrescription {
  _id?: string;
  id?: string;
  reference: string;
  pdfUrl?: string;
  pharmacySnapshot?: PharmacySnapshot;
  sentToPharmacy?: boolean;
  sentToPatientEmail?: boolean;
}

interface Props {
  consultationId: string;
  pharmacySnapshot?: PharmacySnapshot | null;
  onSuccess?: (prescription: CreatedPrescription) => void;
}

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

export default function CreatePrescriptionForm({
  consultationId,
  pharmacySnapshot,
  onSuccess,
}: Props) {
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [medicines, setMedicines] = useState<MedicineRow[]>([
    {
      medicineId: null,
      name: "",
      genericName: "",
      strength: "",
      form: "",
      indication: "",
      adultDose: "",
      dosage: "",
      frequency: "",
      duration: "",
      contraindicationsNotes: "",
      instructions: "",
    },
  ]);

  const hasPharmacy = useMemo(() => {
    return !!(
      pharmacySnapshot &&
      (pharmacySnapshot.name ||
        pharmacySnapshot.email ||
        pharmacySnapshot.phone ||
        pharmacySnapshot.town ||
        pharmacySnapshot.county ||
        pharmacySnapshot.eircode)
    );
  }, [pharmacySnapshot]);

  const handleMedicineChange = (
    index: number,
    field: keyof MedicineRow,
    value: string
  ) => {
    const updated = [...medicines];
    updated[index][field] = value as never;
    setMedicines(updated);
  };

  const handleSelectMedicine = (index: number, selectedMedicine: any) => {
    const updated = [...medicines];

    updated[index] = {
      ...updated[index],
      medicineId: selectedMedicine._id || selectedMedicine.id,
      name: selectedMedicine.medicineName || "",
      genericName: selectedMedicine.genericName || "",
      strength: selectedMedicine.strength || "",
      form: selectedMedicine.form || "",
      indication: selectedMedicine.indication || "",
      adultDose: selectedMedicine.adultDose || "",
      dosage: selectedMedicine.adultDose || "",
      frequency: selectedMedicine.frequency || "",
      duration: selectedMedicine.typicalDuration || "",
      contraindicationsNotes: selectedMedicine.contraindicationsNotes || "",
    };

    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        medicineId: null,
        name: "",
        genericName: "",
        strength: "",
        form: "",
        indication: "",
        adultDose: "",
        dosage: "",
        frequency: "",
        duration: "",
        contraindicationsNotes: "",
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
      const validMedicines = medicines.filter(
        (item) => item.medicineId && item.name.trim()
      );

      if (validMedicines.length === 0) {
        toast.error("At least one selected medicine is required");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("consultationId", consultationId);
      formData.append("diagnosis", diagnosis);
      formData.append("notes", notes);
      formData.append("medicines", JSON.stringify(validMedicines));

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
        onSuccess?.(data.prescription);
        return;
      }

      toast.error(data.message || "Failed to create prescription");
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
      {hasPharmacy && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-3 font-semibold text-white">Selected Pharmacy</h3>
          <div className="space-y-2 text-sm text-slate-300">
            {pharmacySnapshot?.name && (
              <p>
                <span className="text-slate-400">Name: </span>
                {pharmacySnapshot.name}
              </p>
            )}
            {pharmacySnapshot?.email && (
              <p>
                <span className="text-slate-400">Email: </span>
                {pharmacySnapshot.email}
              </p>
            )}
            {pharmacySnapshot?.phone && (
              <p>
                <span className="text-slate-400">Phone: </span>
                {pharmacySnapshot.phone}
              </p>
            )}
            <p className="text-xs text-slate-400">
              Prescription create hone ke baad isi pharmacy ko send ki jayegi.
            </p>
          </div>
        </div>
      )}

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
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer text-black"
            onClick={addMedicine}
          >
            + Add Medicine
          </Button>
        </div>

        {medicines.map((medicine, index) => (
          <MedicineSelectInput
            key={index}
            index={index}
            medicine={medicine}
            onChange={handleMedicineChange}
            onSelectMedicine={handleSelectMedicine}
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