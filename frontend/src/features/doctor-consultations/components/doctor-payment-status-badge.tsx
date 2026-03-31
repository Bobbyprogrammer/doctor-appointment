interface DoctorPaymentStatusBadgeProps {
  status: string;
}

const paymentClasses: Record<string, string> = {
  unpaid: "bg-red-500/10 text-red-300 border-red-500/20",
  paid: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  refunded: "bg-amber-500/10 text-amber-300 border-amber-500/20",
};

export default function DoctorPaymentStatusBadge({
  status,
}: DoctorPaymentStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
        paymentClasses[status] ||
        "bg-slate-500/10 text-slate-300 border-slate-500/20"
      }`}
    >
      {status}
    </span>
  );
}