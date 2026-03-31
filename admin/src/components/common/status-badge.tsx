interface StatusBadgeProps {
  label: string;
}

const StatusBadge = ({ label }: StatusBadgeProps) => {
  return (
    <span className="inline-flex rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-200">
      {label}
    </span>
  );
};

export default StatusBadge;