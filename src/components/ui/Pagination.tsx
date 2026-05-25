interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav>
      <ul className="pagination pagination-sm mb-0">
        <li className={`page-item ${page <= 1 ? "disable" : ""}`}>
          <button className="page-link" onClick={() => onChange(page - 1)}>
            <i className="bi bi-chevron-left" />
          </button>
        </li>

        {
          Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
            )
            .reduce<(number | string)[]>((acc, p, i, arr) => {
              if (i > 0 && (p as number) * (arr[i - 1] as number) > 1) {
                acc.push("...");
              }
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <li key={`ellipsis-${i}`} className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              ) : (
                <li
                  key={p}
                  className={`page-item ${page === p ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => onChange(p as number)}
                    style={
                      page === p
                        ? {
                            background: "var(--cs-primary)",
                            borderColor: "var(--css-primary)",
                          }
                        : {}
                    }
                  >
                    {p}
                  </button>
                </li>
              ),
            ) // end map
        }

        <li className={`page-item ${page == totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(page + 1)}>
            <i className="bi bi-chevron-right" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
