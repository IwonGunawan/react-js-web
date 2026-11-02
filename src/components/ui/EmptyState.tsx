import type { ReactNode } from "react";

interface Props {
  message?: string;
  title?: string;
  description?: string;
  icons?: string;
  action?: ReactNode;
}

export default function EmptyState({
  message = "Tidak ada data",
  title,
  description,
  icons = "bi-inbox",
  action,
}: Props) {
  return (
    <div className="cs-empty">
      <span className="cs-empty-icon">
        <i className={`bi ${icons}`} aria-hidden="true" />
      </span>
      <p className="cs-empty-title">{title ?? message}</p>
      {description && <p className="cs-empty-desc">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
