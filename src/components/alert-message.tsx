type AlertMessageProps = {
  children: React.ReactNode;
  variant: "success" | "error";
  className?: string;
};

export function AlertMessage({ children, variant, className }: AlertMessageProps) {
  const toneClass =
    variant === "success"
      ? "border-emerald-300 bg-emerald-100/80 text-emerald-900"
      : "border-rose-300 bg-rose-100 text-rose-900";

  return (
    <p className={`rounded-xl border px-4 py-3 text-sm ${toneClass} ${className ?? ""}`}>
      {children}
    </p>
  );
}
