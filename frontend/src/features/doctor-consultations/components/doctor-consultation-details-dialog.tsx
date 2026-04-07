"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Consultation, ConsultationStatus } from "@/types/consultation";
import DoctorConsultationStatusBadge from "./doctor-consultation-status-badge";
import DoctorPaymentStatusBadge from "./doctor-payment-status-badge";
import CreatePrescriptionDialog from "@/features/doctor-prescriptions/components/create-prescription-dialog";
import { useDoctorConsultations } from "@/features/doctor-consultations/context/DoctorConsultationsContext";

interface DoctorConsultationDetailsDialogProps {
  consultation: Consultation;
}

const currency = process.env.NEXT_PUBLIC_CURRENCY || "$";

const getAllowedNextStatuses = (
  currentStatus: ConsultationStatus
): ConsultationStatus[] => {
  const transitions: Record<ConsultationStatus, ConsultationStatus[]> = {
    pending_payment: [],
    waiting_for_review: ["under_review", "rejected"],
    under_review: ["doctor_message_sent", "completed", "rejected"],
    doctor_message_sent: ["under_review", "completed", "rejected"],
    completed: [],
    rejected: [],
    cancelled: [],
  };

  return transitions[currentStatus] || [];
};

const formatAnswer = (
  answer: string | number | boolean | string[] | null
): string => {
  if (Array.isArray(answer)) return answer.length ? answer.join(", ") : "—";
  if (typeof answer === "boolean") return answer ? "Yes" : "No";
  if (answer !== null && answer !== undefined && answer !== "") {
    return String(answer);
  }
  return "—";
};

export default function DoctorConsultationDetailsDialog({
  consultation,
}: DoctorConsultationDetailsDialogProps) {
  const { updateConsultationStatus } = useDoctorConsultations();

  const [doctorNote, setDoctorNote] = useState("");
  const [submittingStatus, setSubmittingStatus] = useState(false);
  const [open, setOpen] = useState(false);

  const patient =
    typeof consultation.patientId === "object" ? consultation.patientId : null;

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

  const hasQuestionnaire =
    Array.isArray(consultation.questionnaireAnswers) &&
    consultation.questionnaireAnswers.length > 0;

  const allowedStatuses = useMemo(
    () => getAllowedNextStatuses(consultation.status),
    [consultation.status]
  );

  const consultationId = consultation._id || consultation.id || "";

  const canCreatePrescription =
  consultation.paymentStatus === "paid" &&
  consultation.status !== "rejected" &&
  consultation.status !== "cancelled";

  const handleStatusChange = async (nextStatus: ConsultationStatus) => {
    if (!consultationId) {
      alert("Consultation id not found");
      return;
    }

    try {
      setSubmittingStatus(true);

      const result = await updateConsultationStatus(
        consultationId,
        nextStatus,
        doctorNote
      );

      alert(result.message);

      if (result.success) {
        setDoctorNote("");
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update consultation status");
    } finally {
      setSubmittingStatus(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          View Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-white/10 bg-[#24303d] text-white sm:max-w-5xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Consultation Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-4 font-semibold">Patient</h3>

              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <span className="text-slate-400">Name: </span>
                  {patient ? `${patient.firstName} ${patient.lastName}` : "N/A"}
                </p>
                <p>
                  <span className="text-slate-400">Email: </span>
                  {patient?.email || "N/A"}
                </p>
                <p>
                  <span className="text-slate-400">Patient Type: </span>
                  <span className="capitalize">{consultation.patientType}</span>
                </p>
                <p>
                  <span className="text-slate-400">DOB: </span>
                  {consultation.patientDob
                    ? new Date(consultation.patientDob).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-4 font-semibold">Service</h3>

              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <span className="text-slate-400">Reference: </span>
                  {consultation.reference}
                </p>
                <p>
                  <span className="text-slate-400">Service: </span>
                  {service?.name || "N/A"}
                </p>
                <p>
                  <span className="text-slate-400">Amount: </span>
                  {currency}
                  {consultation.amount}
                </p>
                <p>
                  <span className="text-slate-400">Scheduled At: </span>
                  {consultation.scheduledAt
                    ? new Date(consultation.scheduledAt).toLocaleString()
                    : "Not scheduled"}
                </p>
                {service?.durationMinutes !== undefined && (
                  <p>
                    <span className="text-slate-400">Duration: </span>
                    {service.durationMinutes} minutes
                  </p>
                )}
              </div>
            </div>
          </div>

          {hasPharmacy && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-4 font-semibold">Preferred Pharmacy</h3>

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
                    <span className="text-slate-400">Registration Number: </span>
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

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-4 font-semibold">Status</h3>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm text-slate-400">
                    Consultation Status
                  </p>
                  <DoctorConsultationStatusBadge status={consultation.status} />
                </div>

                <div>
                  <p className="mb-2 text-sm text-slate-400">Payment Status</p>
                  <DoctorPaymentStatusBadge status={consultation.paymentStatus} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-4 font-semibold">Notes</h3>
              <p className="whitespace-pre-line text-sm text-slate-300">
                {consultation.notes || "No notes provided."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-4 font-semibold">Update Consultation Status</h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Doctor Note
                </label>
                <textarea
                  value={doctorNote}
                  onChange={(e) => setDoctorNote(e.target.value)}
                  rows={4}
                  placeholder="Add optional note before updating consultation status..."
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  disabled={submittingStatus}
                />
              </div>

              {consultation.paymentStatus !== "paid" ? (
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
                  This consultation cannot be processed until payment is completed.
                </div>
              ) : allowedStatuses.length === 0 ? (
                <div className="rounded-xl border border-slate-700 bg-black/20 px-4 py-3 text-sm text-slate-400">
                  No further status changes are available for this consultation.
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {allowedStatuses.includes("under_review") && (
                    <Button
                      type="button"
                      onClick={() => handleStatusChange("under_review")}
                      disabled={submittingStatus}
                      className="bg-blue-600 text-white hover:bg-blue-500"
                    >
                      {submittingStatus ? "Saving..." : "Mark Under Review"}
                    </Button>
                  )}

                  {allowedStatuses.includes("doctor_message_sent") && (
                    <Button
                      type="button"
                      onClick={() => handleStatusChange("doctor_message_sent")}
                      disabled={submittingStatus}
                      className="bg-amber-600 text-white hover:bg-amber-500"
                    >
                      {submittingStatus ? "Saving..." : "Mark Doctor Message Sent"}
                    </Button>
                  )}

                  {allowedStatuses.includes("completed") && (
                    <Button
                      type="button"
                      onClick={() => handleStatusChange("completed")}
                      disabled={submittingStatus}
                      className="bg-green-600 text-white hover:bg-green-500"
                    >
                      {submittingStatus ? "Saving..." : "Mark Completed"}
                    </Button>
                  )}

                  {allowedStatuses.includes("rejected") && (
                    <Button
                      type="button"
                      onClick={() => handleStatusChange("rejected")}
                      disabled={submittingStatus}
                      variant="destructive"
                    >
                      {submittingStatus ? "Saving..." : "Reject Consultation"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {hasQuestionnaire && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-4 font-semibold">Questionnaire Answers</h3>

              <div className="grid gap-3 md:grid-cols-2">
                {consultation.questionnaireAnswers.map((item, index) => (
                  <div
                    key={`${item.questionId}-${index}`}
                    className="rounded-xl bg-black/30 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {item.questionType?.replaceAll("_", " ") || "Question"}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {item.questionText}
                    </p>
                    <p className="mt-2 text-sm text-slate-200">
                      {formatAnswer(item.answer)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {consultation.files?.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-3 font-semibold">Uploaded Files</h3>

              <div className="space-y-2">
                {consultation.files.map((file, index) => (
                  <a
                    key={file.public_id || index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={file.name}
                    className="block rounded-xl bg-white/5 px-4 py-3 text-sm text-blue-300 hover:bg-white/10"
                  >
                    {file.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            {canCreatePrescription && (
             <CreatePrescriptionDialog
  consultationId={consultationId}
  patientEmail={patient?.email}
  pharmacySnapshot={consultation.selectedPharmacySnapshot}
/>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}