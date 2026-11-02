import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}

export default function PageHeader({ title, description, actions }: Props) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-head-actions">{actions}</div>}
    </div>
  );
}
