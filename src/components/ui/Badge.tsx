import type { ReactNode } from "react";

export type BadgeTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

interface Props {
  tone?: BadgeTone;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

export default function Badge({
  tone = "neutral",
  dot = false,
  children,
  className = "",
}: Props) {
  return (
    <span className={`cs-badge cs-badge-${tone} ${className}`.trim()}>
      {dot && <span className="cs-badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
