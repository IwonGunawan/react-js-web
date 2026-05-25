interface Props {
  message?: string;
  icons?: string;
}

export default function EmptyState({
  message = "Tidak ada data",
  icons = "bi-inbox",
}: Props) {
  return (
    <div className="text-center py-5 text-muted">
      <i className={`bi ${icons} fs-1 d-block md-2 opacity-25`} />
      <p className="small mb-0">{message}</p>
    </div>
  );
}
