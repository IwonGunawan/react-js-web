interface Props {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({ className = "", width, height }: Props) {
  return (
    <span
      className={`cs-skeleton ${className}`.trim()}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="cs-skeleton-table" aria-hidden="true">
      {Array.from({ length: rows }).map((_, row) => (
        <div className="cs-skeleton-row" key={row}>
          {Array.from({ length: cols }).map((_, col) => (
            <Skeleton
              key={col}
              height={12}
              width={col === 0 ? "60%" : col === cols - 1 ? "50%" : "80%"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
