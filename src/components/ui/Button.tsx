import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: string;
  block?: boolean;
  children?: ReactNode;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-outline-secondary",
  ghost: "btn-light",
  danger: "btn-danger",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  block = false,
  className = "",
  disabled,
  type = "button",
  children,
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={[
        "btn",
        VARIANT_CLASS[variant],
        size === "sm" ? "btn-sm" : "",
        block ? "w-100" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
      ) : (
        icon && <i className={`bi ${icon}`} aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
