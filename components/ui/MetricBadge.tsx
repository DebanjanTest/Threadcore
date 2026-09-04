interface MetricBadgeProps {
  label: string;
  value: string | number;
  variant?: "default" | "success" | "error" | "warning";
}

const variantStyles = {
  default: "border-border text-foreground",
  success: "border-success/30 text-success",
  error: "border-error/30 text-error",
  warning: "border-warning/30 text-warning",
};

export default function MetricBadge({
  label,
  value,
  variant = "default",
}: MetricBadgeProps) {
  return (
    <div
      className={`
        inline-flex items-center gap-2
        border px-3 py-1.5
        font-mono text-[10px] uppercase tracking-widest
        ${variantStyles[variant]}
      `}
    >
      <span className="text-text-muted">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
