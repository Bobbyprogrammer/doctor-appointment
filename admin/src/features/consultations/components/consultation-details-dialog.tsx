"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  AssignableDoctor,
  Consultation,
  GetAssignableDoctorsResponse,
} from "@/types/consultation";
import { useConsultations } from "@/features/consultations/context/ConsultationsContext";
import ConsultationStatusBadge from "@/components/common/consultation-status-badge";
import PaymentStatusBadge from "@/components/common/payment-status-badge";
import api from "@/lib/axios";

interface ConsultationDetailsDialogProps {
  consultation: Consultation;
}

const getEntityId = (
  value?: { _id?: string; id?: string } | string | null
): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString();
};

const formatAnswer = (
  answer: string | number | boolean | string[] | null | undefined
) => {
  if (answer === null || answer === undefined) return "N/A";
  if (Array.isArray(answer)) return answer.length ? answer.join(", ") : "N/A";
  if (typeof answer === "boolean") return answer ? "Yes" : "No";
  if (typeof answer === "string") return answer.trim() || "N/A";
  return String(answer);
};

export default function ConsultationDetailsDialog({
  consultation,
}: ConsultationDetailsDialogProps) {
  const { doctorsLoading, assignDoctorToConsultation } =
    useConsultations() as any;

  const [open, setOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [assignNote, setAssignNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [assignableDoctors, setAssignableDoctors] = useState<AssignableDoctor[]>(
    []
  );
  const [doctorLoading, setDoctorLoading] = useState(false);

  const patient =
    typeof consultation.patientId === "object" ? consultation.patientId : null;

  const doctor =
    typeof consultation.doctorId === "object" ? consultation.doctorId : null;

  const service =
    typeof consultation.serviceId === "object" ? consultation.serviceId : null;

  const pharmacySnapshot = consultation.selectedPharmacySnapshot || null;

  const hasPharmacy =
    consultation.pharmacySelectionType &&
    consultation.pharmacySelectionType !== "none" &&
    pharmacySnapshot &&
    (pharmacySnapshot.name ||
      pharmacySnapshot.email ||
      pharmacySnapshot.phone ||
      pharmacySnapshot.town ||
      pharmacySnapshot.county ||
      pharmacySnapshot.eircode);

  const currentDoctorId = useMemo(
    () => getEntityId(consultation.doctorId),
    [consultation.doctorId]
  );

  const fetchAssignableDoctors = async () => {
    try {
      if (!consultation._id && !consultation.id) return;

      setDoctorLoading(true);

      const consultationId = consultation._id || consultation.id;

      const { data } = await api.get<GetAssignableDoctorsResponse>(
        `/consultations/admin/${consultationId}/assignable-doctors`
      );

      if (data.success) {
        setAssignableDoctors(data.doctors || []);
      } else {
        setAssignableDoctors([]);
      }
    } catch (error) {
      console.error("Error fetching assignable doctors:", error);
      setAssignableDoctors([]);
    } finally {
      setDoctorLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAssignableDoctors();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setSelectedDoctorId(currentDoctorId);
    }
  }, [open, currentDoctorId]);

  const handleAssignDoctor = async () => {
    if (!consultation._id && !consultation.id) {
      alert("Consultation id not found");
      return;
    }

    if (!selectedDoctorId) {
      alert("Please select a doctor");
      return;
    }

    try {
      setSubmitting(true);

      const consultationId = consultation._id || consultation.id || "";

      const result = await assignDoctorToConsultation(
        consultationId,
        selectedDoctorId,
        assignNote
      );

      alert(result.message);

      if (result.success) {
        setAssignNote("");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to assign doctor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600"
      >
        View Details
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700 bg-slate-900 px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Consultation Details
                </h2>
                <p className="text-sm text-slate-400">
                  Reference: {consultation.reference}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Status
                  </p>
                  <div className="mt-2">
                    <ConsultationStatusBadge status={consultation.status} />
                  </div>
                </div>

                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Payment
                  </p>
                  <div className="mt-2">
                    <PaymentStatusBadge status={consultation.paymentStatus} />
                  </div>
                </div>

                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Amount
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    ${Number(consultation.amount || 0).toFixed(2)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Scheduled At
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {formatDateTime(consultation.scheduledAt)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-slate-800 p-5">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Patient Information
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-400">Full Name</p>
                      <p className="font-medium text-white">
                        {patient
                          ? `${patient.firstName} ${patient.lastName}`
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Email</p>
                      <p className="font-medium text-white">
                        {patient?.email || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Patient Type</p>
                      <p className="font-medium capitalize text-white">
                        {consultation.patientType || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Date of Birth</p>
                      <p className="font-medium text-white">
                        {consultation.patientDob
                          ? new Date(
                              consultation.patientDob
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-800 p-5">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Doctor Information
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-400">Assigned Doctor</p>
                      <p className="font-medium text-white">
                        {doctor
                          ? `${doctor.firstName} ${doctor.lastName}`
                          : "Not assigned"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Email</p>
                      <p className="font-medium text-white">
                        {doctor?.email || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Doctor Id</p>
                      <p className="break-all font-medium text-white">
                        {currentDoctorId || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-800 p-5">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Service Information
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-400">Service Name</p>
                      <p className="font-medium text-white">
                        {service?.name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Price</p>
                      <p className="font-medium text-white">
                        ${Number(service?.price || 0).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Duration</p>
                      <p className="font-medium text-white">
                        {service?.durationMinutes || 0} min
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {hasPharmacy && (
                <div className="rounded-xl bg-slate-800 p-5">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Preferred Pharmacy
                  </h3>

                  <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                    <p>
                      <span className="text-slate-400">Selection Type: </span>
                      <span className="capitalize">
                        {consultation.pharmacySelectionType === "listed"
                          ? "From list"
                          : consultation.pharmacySelectionType === "other"
                          ? "Other pharmacy"
                          : "None"}
                      </span>
                    </p>

                    {pharmacySnapshot?.registrationNumber && (
                      <p>
                        <span className="text-slate-400">
                          Registration Number:{" "}
                        </span>
                        {pharmacySnapshot.registrationNumber}
                      </p>
                    )}

                    {pharmacySnapshot?.name && (
                      <p>
                        <span className="text-slate-400">Pharmacy Name: </span>
                        {pharmacySnapshot.name}
                      </p>
                    )}

                    {pharmacySnapshot?.phone && (
                      <p>
                        <span className="text-slate-400">Phone: </span>
                        {pharmacySnapshot.phone}
                      </p>
                    )}

                    {pharmacySnapshot?.email && (
                      <p>
                        <span className="text-slate-400">Email: </span>
                        {pharmacySnapshot.email}
                      </p>
                    )}

                    {pharmacySnapshot?.street1 && (
                      <p>
                        <span className="text-slate-400">Street 1: </span>
                        {pharmacySnapshot.street1}
                      </p>
                    )}

                    {pharmacySnapshot?.street2 && (
                      <p>
                        <span className="text-slate-400">Street 2: </span>
                        {pharmacySnapshot.street2}
                      </p>
                    )}

                    {pharmacySnapshot?.street3 && (
                      <p>
                        <span className="text-slate-400">Street 3: </span>
                        {pharmacySnapshot.street3}
                      </p>
                    )}

                    {pharmacySnapshot?.town && (
                      <p>
                        <span className="text-slate-400">Town: </span>
                        {pharmacySnapshot.town}
                      </p>
                    )}

                    {pharmacySnapshot?.county && (
                      <p>
                        <span className="text-slate-400">County: </span>
                        {pharmacySnapshot.county}
                      </p>
                    )}

                    {pharmacySnapshot?.eircode && (
                      <p>
                        <span className="text-slate-400">Eircode: </span>
                        {pharmacySnapshot.eircode}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="rounded-xl bg-slate-800 p-5">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Admin Assign / Reassign Doctor
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Select Doctor
                    </label>
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      disabled={doctorsLoading || doctorLoading || submitting}
                      className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none"
                    >
                      <option value="">Choose doctor</option>

                      {assignableDoctors.map((doc) => {
                        const docId = doc._id || doc.id;
                        return (
                          <option key={docId} value={docId}>
                            {doc.firstName} {doc.lastName} - {doc.email}
                            {doc.specialization
                              ? ` (${doc.specialization})`
                              : ""}
                            {typeof doc.activeConsultations === "number"
                              ? ` - ${doc.activeConsultations} active`
                              : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Note
                    </label>
                    <input
                      type="text"
                      value={assignNote}
                      onChange={(e) => setAssignNote(e.target.value)}
                      placeholder="Optional admin note"
                      disabled={submitting}
                      className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAssignDoctor}
                    disabled={submitting || !selectedDoctorId}
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting
                      ? "Saving..."
                      : currentDoctorId
                      ? "Reassign Doctor"
                      : "Assign Doctor"}
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-slate-800 p-5">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Notes
                </h3>
                <p className="whitespace-pre-line text-sm text-slate-300">
                  {consultation.notes?.trim() || "No notes added."}
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-5">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Questionnaire Answers
                </h3>

                {consultation.questionnaireAnswers?.length ? (
                  <div className="space-y-3">
                    {consultation.questionnaireAnswers.map((item, index) => (
                      <div
                        key={`${item.questionId}-${index}`}
                        className="rounded-lg border border-slate-700 bg-slate-900 p-4"
                      >
                        <p className="text-sm font-medium text-white">
                          {item.questionText}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Type: {item.questionType}
                        </p>
                        <p className="mt-2 text-sm text-slate-200">
                          {formatAnswer(item.answer)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No questionnaire answers found.
                  </p>
                )}
              </div>

              <div className="rounded-xl bg-slate-800 p-5">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Uploaded Files
                </h3>

                {consultation.files?.length ? (
                  <div className="space-y-3">
                    {consultation.files.map((file, index) => (
                      <div
                        key={`${file.public_id}-${index}`}
                        className="flex flex-col gap-2 rounded-lg border border-slate-700 bg-slate-900 p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="font-medium text-white">{file.name}</p>
                          <p className="text-sm text-slate-400">{file.type}</p>
                        </div>

                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600"
                        >
                          View File
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No files uploaded.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Emergency Flag
                  </p>
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      consultation.hasEmergencyFlag
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {consultation.hasEmergencyFlag ? "Yes" : "No"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Created At
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {formatDateTime(consultation.createdAt)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Updated At
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {formatDateTime(consultation.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}