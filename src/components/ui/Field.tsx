import type { ReactNode } from "react";

interface Props {
  label?: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export default function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className = "",
}: Props) {
  return (
    <div className={className}>
      {label && (
        <label className="form-label" htmlFor={htmlFor}>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="field-hint">{hint}</p>
      )}
    </div>
  );
}
