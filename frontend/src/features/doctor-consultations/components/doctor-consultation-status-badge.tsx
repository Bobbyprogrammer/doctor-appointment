interface DoctorConsultationStatusBadgeProps {
  status: string;
}

const statusClasses: Record<string, string> = {
  pending_payment: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  waiting_for_review: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  under_review: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  doctor_message_sent: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  completed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-300 border-red-500/20",
  cancelled: "bg-slate-500/10 text-slate-300 border-slate-500/20",
};

export default function DoctorConsultationStatusBadge({
  status,
}: DoctorConsultationStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
        statusClasses[status] ||
        "bg-slate-500/10 text-slate-300 border-slate-500/20"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}