"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useConsultations } from "../context/ConsultationsContext";
import type {
  ConsultationQuestionnaireAnswerInput,
  PatientType,
} from "@/types/consultation";
import PatientTypeSelector from "./patient-type-selector";
import ConsultationFileUpload from "./consultation-file-upload";
import DynamicQuestionnaire from "./consultation-dynamic-questionnaire";
import { useAuth } from "@/features/auth/context/AuthContext";
import api from "@/lib/axios";
import Select from "react-select";

interface ConsultationBookingFormProps {
  serviceId: string;
  serviceName: string;
  amount: number;
}

interface Pharmacy {
  _id: string;
  registrationNumber?: string;
  name: string;
  street1?: string;
  street2?: string;
  street3?: string;
  town?: string;
  county?: string;
  eircode?: string;
  phone?: string;
  email?: string;
}

interface GetPharmaciesResponse {
  success: boolean;
  pharmacies: Pharmacy[];
  total?: number;
  page?: number;
  totalPages?: number;
  message?: string;
}

const currency = process.env.NEXT_PUBLIC_CURRENCY;

export default function ConsultationBookingForm({
  serviceId,
  serviceName,
  amount,
}: ConsultationBookingFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { createConsultation, startConsultationPayment } = useConsultations();

  const [patientType, setPatientType] = useState<PatientType>("self");
  const [patientDob, setPatientDob] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<
    ConsultationQuestionnaireAnswerInput[]
  >([]);

  // Pharmacy state
  const [pharmacySelectionType, setPharmacySelectionType] = useState<
    "none" | "listed" | "other"
  >("none");

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [pharmaciesLoading, setPharmaciesLoading] = useState(false);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState("");

  const [otherPharmacyName, setOtherPharmacyName] = useState("");
  const [otherPharmacyPhone, setOtherPharmacyPhone] = useState("");
  const [otherPharmacyEmail, setOtherPharmacyEmail] = useState("");

  const isPrescriptionRelatedService = useMemo(() => {
    const text = `${serviceName}`.toLowerCase();
    return text.includes("prescription");
  }, [serviceName]);

  const fetchPharmacies = async () => {
    try {
      setPharmaciesLoading(true);
  
      const { data } = await api.get<GetPharmaciesResponse>("/pharmacies", {
        params: {
          limit: 5000,
        },
      });
  
      if (data.success) {
        setPharmacies(data.pharmacies || []);
      } else {
        setPharmacies([]);
      }
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
      setPharmacies([]);
    } finally {
      setPharmaciesLoading(false);
    }
  };

  useEffect(() => {
    if (pharmacySelectionType === "listed") {
      fetchPharmacies();
    }
  }, [pharmacySelectionType]);

 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first to continue booking");
      router.push("/login");
      return;
    }

    if (isPrescriptionRelatedService) {
      if (pharmacySelectionType === "none") {
        toast.error("Please select a pharmacy or choose Other Pharmacy");
        return;
      }

      if (pharmacySelectionType === "listed" && !selectedPharmacyId) {
        toast.error("Please select a pharmacy from the list");
        return;
      }

      if (pharmacySelectionType === "other") {
        if (
          !otherPharmacyName.trim() ||
          !otherPharmacyPhone.trim() ||
          !otherPharmacyEmail.trim()
        ) {
          toast.error(
            "Please enter pharmacy name, phone number, and email for Other Pharmacy"
          );
          return;
        }
      }
    }

    try {
      setSubmitting(true);

      const filteredAnswers = questionnaireAnswers.filter(
        (item) =>
          item.questionId &&
          item.answer !== undefined &&
          item.answer !== null &&
          !(typeof item.answer === "string" && item.answer.trim() === "") &&
          !(Array.isArray(item.answer) && item.answer.length === 0)
      );

      const payload: any = {
        serviceId,
        patientType,
        patientDob: patientDob || null,
        scheduledAt: scheduledAt || null,
        notes,
        questionnaireAnswers: filteredAnswers,
        redFlags: {
          chestPain: false,
          severeBreathingDifficulty: false,
          confusion: false,
          severeAbdominalPain: false,
          fainting: false,
        },
        files,
      };

      if (pharmacySelectionType === "listed") {
        payload.pharmacySelectionType = "listed";
        payload.selectedPharmacyId = selectedPharmacyId;
      } else if (pharmacySelectionType === "other") {
        payload.pharmacySelectionType = "other";
        payload.selectedPharmacyOther = {
          name: otherPharmacyName.trim(),
          phone: otherPharmacyPhone.trim(),
          email: otherPharmacyEmail.trim(),
        };
      } else {
        payload.pharmacySelectionType = "none";
      }

      
      const res = await createConsultation(payload);

      if (!res.success) {
        toast.error(res.message || "Failed to create consultation");
        return;
      }

      const consultationId = res.consultation?._id || res.consultation?.id;

      if (!consultationId) {
        toast.error("Consultation created but payment could not be started");
        router.push("/patient/consultations?created=true");
        return;
      }

      const paymentRes = await startConsultationPayment(consultationId);

      if (paymentRes.success && paymentRes.url) {
        window.location.href = paymentRes.url;
        return;
      }

      toast.error(
        paymentRes.message || "Consultation created but payment could not be started"
      );
      router.push("/patient/consultations?created=true");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-3xl border border-white/10 bg-white p-8 text-black shadow-sm">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide">
              Consultation Booking
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">{serviceName}</h1>
            <p>
              Complete the form below to request your consultation. Please fill
              in accurate details so the doctor can review your case properly.
            </p>

            <div className="pt-2">
              <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-medium">
                Consultation Fee: {currency}
                {amount}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white p-8 text-black shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Patient Information</h2>
            <p className="mt-2 text-sm">
              Tell us who this consultation is for and provide the required
              patient details.
            </p>
          </div>

          <PatientTypeSelector value={patientType} onChange={setPatientType} />

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient Date of Birth</label>
              <input
                type="date"
                value={patientDob}
                onChange={(e) => setPatientDob(e.target.value)}
                className="h-12 w-full rounded-xl border border-black/30 bg-white px-4 text-black outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Schedule</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="h-12 w-full rounded-xl border border-black/30 bg-white px-4 text-black outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-8 text-black shadow-sm">
          <DynamicQuestionnaire
            serviceId={serviceId}
            answers={questionnaireAnswers}
            setAnswers={setQuestionnaireAnswers}
          />
        </div>

        <div className="rounded-3xl border border-white/20 bg-white p-8 text-black shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Preferred Pharmacy</h2>
            <p className="mt-2 text-sm">
              {isPrescriptionRelatedService
                ? "Select the pharmacy where you want your prescription to be sent."
                : "You can optionally choose a pharmacy if needed."}
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid gap-3 md:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  setPharmacySelectionType("listed");
                  setOtherPharmacyName("");
                  setOtherPharmacyPhone("");
                  setOtherPharmacyEmail("");
                }}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  pharmacySelectionType === "listed"
                    ? "border-blue-600 bg-blue-50"
                    : "border-black/20 bg-white"
                }`}
              >
                Select from list
              </button>

              <button
                type="button"
                onClick={() => {
                  setPharmacySelectionType("other");
                  setSelectedPharmacyId("");
                }}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  pharmacySelectionType === "other"
                    ? "border-blue-600 bg-blue-50"
                    : "border-black/20 bg-white"
                }`}
              >
                Other pharmacy
              </button>

              <button
                type="button"
                onClick={() => {
                  setPharmacySelectionType("none");
                  setSelectedPharmacyId("");
                  setOtherPharmacyName("");
                  setOtherPharmacyPhone("");
                  setOtherPharmacyEmail("");
                }}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  pharmacySelectionType === "none"
                    ? "border-blue-600 bg-blue-50"
                    : "border-black/20 bg-white"
                }`}
              >
                No pharmacy
              </button>
            </div>

            {pharmacySelectionType === "listed" && (
  <div className="space-y-4">
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Pharmacy</label>

      <Select
        isLoading={pharmaciesLoading}
        options={pharmacies.map((pharmacy) => ({
          value: pharmacy._id,
          label: `${pharmacy.name}${
            pharmacy.town ? ` - ${pharmacy.town}` : ""
          }${pharmacy.county ? `, ${pharmacy.county}` : ""}${
            pharmacy.eircode ? `, ${pharmacy.eircode}` : ""
          }`,
        }))}
        value={
          pharmacies
            .map((pharmacy) => ({
              value: pharmacy._id,
              label: `${pharmacy.name}${
                pharmacy.town ? ` - ${pharmacy.town}` : ""
              }${pharmacy.county ? `, ${pharmacy.county}` : ""}${
                pharmacy.eircode ? `, ${pharmacy.eircode}` : ""
              }`,
            }))
            .find((option) => option.value === selectedPharmacyId) || null
        }
        onChange={(selectedOption) =>
          setSelectedPharmacyId(selectedOption?.value || "")
        }
        placeholder="Search and select pharmacy..."
        isClearable
        isSearchable
        noOptionsMessage={() => "No pharmacies found"}
        className="text-black"
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "48px",
            borderRadius: "12px",
            borderColor: state.isFocused ? "#2563eb" : "rgba(0,0,0,0.3)",
            boxShadow: "none",
            "&:hover": {
              borderColor: "#2563eb",
            },
          }),
          menu: (base) => ({
            ...base,
            borderRadius: "12px",
            overflow: "hidden",
            zIndex: 50,
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused
              ? "#eff6ff"
              : state.isSelected
              ? "#dbeafe"
              : "white",
            color: "black",
            cursor: "pointer",
          }),
        }}
      />
    </div>

    {selectedPharmacyId && (
      <p className="text-sm text-green-600">
        Pharmacy selected successfully.
      </p>
    )}
  </div>
)}

            {pharmacySelectionType === "other" && (
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pharmacy Name</label>
                  <input
                    type="text"
                    value={otherPharmacyName}
                    onChange={(e) => setOtherPharmacyName(e.target.value)}
                    placeholder="Enter pharmacy name"
                    className="h-12 w-full rounded-xl border border-black/30 bg-white px-4 text-black outline-none transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Pharmacy Phone</label>
                  <input
                    type="text"
                    value={otherPharmacyPhone}
                    onChange={(e) => setOtherPharmacyPhone(e.target.value)}
                    placeholder="Enter pharmacy phone number"
                    className="h-12 w-full rounded-xl border border-black/30 bg-white px-4 text-black outline-none transition"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Pharmacy Email</label>
                  <input
                    type="email"
                    value={otherPharmacyEmail}
                    onChange={(e) => setOtherPharmacyEmail(e.target.value)}
                    placeholder="Enter pharmacy email"
                    className="h-12 w-full rounded-xl border border-black/30 bg-white px-4 text-black outline-none transition"
                  />
                </div>
              </div>
            )}

            {isPrescriptionRelatedService && pharmacySelectionType === "none" && (
              <p className="text-sm text-red-500">
                Pharmacy selection is required for prescription-related services.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white p-8 text-black shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Additional Notes</h2>
            <p className="mt-2 text-sm">
              Add any important symptoms, concerns, or context that may help the
              doctor review your case.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[180px] w-full rounded-2xl border border-white/20 bg-white px-4 py-3 text-black outline-none transition"
              placeholder="Describe symptoms, duration, severity, or any other important details"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white p-8 text-black shadow-sm">
          <ConsultationFileUpload files={files} onChange={setFiles} />
        </div>

        <div className="rounded-3xl border border-white/20 bg-white p-8 text-black shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold">Ready to submit?</h3>
              <p className="mt-1 text-sm">
                Review your details before sending the consultation request.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {!user ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-12 px-8"
                    onClick={() => router.push("/login")}
                  >
                    Login to Continue
                  </Button>

                  <Button
                    type="button"
                    size="lg"
                    className="h-12 px-8"
                    onClick={() => router.push("/register")}
                  >
                    Create Account
                  </Button>
                </>
              ) : (
                <Button type="submit" size="lg" className="h-12 px-8">
                  {submitting ? "Processing..." : "Submit & Pay Now"}
                </Button>
              )}
            </div>
          </div>

          {!user && (
            <p className="mt-4 text-sm text-red-500">
              You must be logged in to submit a consultation booking.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}