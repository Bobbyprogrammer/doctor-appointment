"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDoctorSickCertificates } from "../context/DoctorSickCertificatesContext";
import type {
  SickCertificateRequest,
  SickCertificateStatus,
} from "@/types/sick-certificate";

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function YesNo({ value }: { value?: boolean }) {
  return <span>{value ? "Yes" : "No"}</span>;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-1 text-sm text-white">{value || "-"}</div>
    </div>
  );
}

export default function DoctorSickCertificateDialog({
  request,
}: {
  request: SickCertificateRequest;
}) {
  const [open, setOpen] = useState(false);
  const [doctorNote, setDoctorNote] = useState(request.doctorReviewNotes || "");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { updateStatus, generatePdf, sendToPatient } =
    useDoctorSickCertificates();

  const handleStatus = async (status: SickCertificateStatus) => {
    try {
      setActionLoading(status);

      const res = await updateStatus(request._id!, status);

      if (res.success) {
        toast.success(res.message || "Status updated");
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const handleGeneratePdf = async () => {
    try {
      setActionLoading("pdf");
      const res = await generatePdf(request._id!);
      toast.success( "PDF generated successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to generate PDF");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendToPatient = async () => {
    try {
      setActionLoading("send");
      const res = await sendToPatient(request._id!);
      toast.success( "Certificate sent to patient");
    } catch (error: any) {
      toast.error(error?.message || "Failed to send email");
    } finally {
      setActionLoading(null);
    }
  };

  const patient =
    typeof request.patientId === "object" ? request.patientId : null;

  const doctor =
    typeof request.doctorId === "object" ? request.doctorId : null;

  const canGeneratePdf =
    request.status === "approved" ||
    request.status === "certificate_generated";

  const canSendToPatient = !!request.certificatePdfUrl;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Review</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-5xl border-white/10 bg-[#24303d] p-0 text-white sm:max-w-5xl">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Sick Certificate Review</h2>
              <p className="text-sm text-slate-400">
                Reference: {request.reference}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
                Status: {request.status}
              </span>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                Payment: {request.paymentStatus}
              </span>
              <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-300">
                {request.variationType} • €{Number(request.amount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">
          <div className="space-y-8">
            {/* PATIENT INFO */}
            <section>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Patient Information
              </h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <DetailRow
                  label="Patient Account"
                  value={
                    patient
                      ? `${patient.firstName} ${patient.lastName}`
                      : "N/A"
                  }
                />
                <DetailRow
                  label="Patient Account Email"
                  value={patient?.email || "-"}
                />
                <DetailRow
                  label="Assigned Doctor"
                  value={
                    doctor
                      ? `${doctor.firstName} ${doctor.lastName}`
                      : "Assigned"
                  }
                />
                <DetailRow
                  label="Form First Name"
                  value={request.firstName}
                />
                <DetailRow
                  label="Form Last Name"
                  value={request.lastName}
                />
                <DetailRow label="Form Email" value={request.email} />
                <DetailRow label="Phone" value={request.phone} />
                <DetailRow
                  label="Date of Birth"
                  value={formatDate(request.dateOfBirth)}
                />
                <DetailRow
                  label="Gender"
                  value={
                    request.gender
                      ? request.gender.charAt(0).toUpperCase() +
                        request.gender.slice(1)
                      : "-"
                  }
                />
              </div>
            </section>

            {/* ADDRESS */}
            <section>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Address Details
              </h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <DetailRow label="Address Line 1" value={request.addressLine1} />
                <DetailRow
                  label="Address Line 2"
                  value={request.addressLine2 || "-"}
                />
                <DetailRow label="City" value={request.city} />
                <DetailRow
                  label="State / Region"
                  value={request.stateRegion || "-"}
                />
                <DetailRow
                  label="Postal Code"
                  value={request.postalCode || "-"}
                />
                <DetailRow label="Country" value={request.country} />
              </div>
            </section>

            {/* CERTIFICATE DETAILS */}
            <section>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Certificate Details
              </h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <DetailRow
                  label="Purpose"
                  value={request.certificatePurpose}
                />
                <DetailRow
                  label="Employer / Organization"
                  value={request.employerOrOrganization}
                />
                <DetailRow
                  label="Consultation Reason"
                  value={request.consultationReason}
                />
                <DetailRow
                  label="Requested Start Date"
                  value={formatDate(request.startDate)}
                />
                <DetailRow
                  label="Requested End Date"
                  value={formatDate(request.endDate)}
                />
                <DetailRow
                  label="Issued At"
                  value={formatDateTime(request.certificateIssueDate)}
                />
              </div>
            </section>

            {/* MEDICAL REVIEW */}
            <section>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Medical Review
              </h3>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <DetailRow
                  label="Medical Emergency"
                  value={<YesNo value={request.hasMedicalEmergency} />}
                />
                <DetailRow
                  label="Can Travel To Clinic"
                  value={<YesNo value={request.canTravelToClinic} />}
                />
                <DetailRow
                  label="Pregnant"
                  value={<YesNo value={request.isPregnant} />}
                />
                <DetailRow
                  label="Aware Of Red Flags"
                  value={<YesNo value={request.awareOfRedFlags} />}
                />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Symptoms
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {request.symptoms?.length ? (
                      request.symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200"
                        >
                          {symptom}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No symptoms listed</p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Illness Description
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
                    {request.illnessDescription || "No description provided."}
                  </p>
                </div>
              </div>
            </section>

            {/* PROOF FILES */}
            <section>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Uploaded Proof Files
              </h3>

              <div className="space-y-3">
                {request.proofFiles?.length ? (
                  request.proofFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-xs text-slate-400">{file.type}</p>
                      </div>

                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                      >
                        View File
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                    No proof files uploaded.
                  </div>
                )}
              </div>
            </section>

            {/* DOCTOR REVIEW NOTES */}
            <section>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Doctor Review Notes
              </h3>

              <textarea
                value={doctorNote}
                onChange={(e) => setDoctorNote(e.target.value)}
                placeholder="Add your medical review notes here..."
                className="min-h-[130px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-indigo-500"
              />
            </section>

            {/* PDF + EMAIL INFO */}
            <section>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Certificate Output
              </h3>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <DetailRow
                  label="PDF Generated"
                  value={request.certificatePdfUrl ? "Yes" : "No"}
                />
                <DetailRow
                  label="Sent To Patient"
                  value={<YesNo value={request.sentToPatientEmail} />}
                />
                <DetailRow
                  label="Sent At"
                  value={formatDateTime(request.sentToPatientEmailAt)}
                />
              </div>

              {request.certificatePdfUrl ? (
                <div className="mt-4">
                  <a
                    href={request.certificatePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
                  >
                    View Generated PDF
                  </a>
                </div>
              ) : null}
            </section>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 border-t border-white/10 bg-[#24303d] px-6 py-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleStatus("under_review")}
              disabled={actionLoading !== null}
              className="bg-blue-600 hover:bg-blue-500"
            >
              {actionLoading === "under_review" ? "Updating..." : "Start Review"}
            </Button>

            <Button
              className="bg-green-600 hover:bg-green-500"
              onClick={() => handleStatus("approved")}
              disabled={actionLoading !== null}
            >
              {actionLoading === "approved" ? "Approving..." : "Approve"}
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-500"
              onClick={() => handleStatus("rejected")}
              disabled={actionLoading !== null}
            >
              {actionLoading === "rejected" ? "Rejecting..." : "Reject"}
            </Button>

            <Button
              onClick={handleGeneratePdf}
              className="bg-indigo-600 hover:bg-indigo-500"
              disabled={actionLoading !== null || !canGeneratePdf}
            >
              {actionLoading === "pdf" ? "Generating..." : "Generate PDF"}
            </Button>

            <Button
              onClick={handleSendToPatient}
              className="bg-orange-600 hover:bg-orange-500"
              disabled={actionLoading !== null || !canSendToPatient}
            >
              {actionLoading === "send" ? "Sending..." : "Send to Patient"}
            </Button>
          </div>

          {!canGeneratePdf && (
            <p className="mt-3 text-xs text-slate-400">
              Approve the request first before generating the certificate PDF.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}