import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export default function Input({
  invalid = false,
  className = "",
  ...rest
}: Props) {
  return (
    <input
      className={["form-control", invalid ? "is-invalid" : "", className]
        .filter(Boolean)
        .join(" ")}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}
