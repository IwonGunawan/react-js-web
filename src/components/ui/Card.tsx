import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export default function Card({
  children,
  className = "",
  padded = true,
}: Props) {
  return (
    <section
      className={[
        "cs-card",
        padded ? "cs-card-padded" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}
