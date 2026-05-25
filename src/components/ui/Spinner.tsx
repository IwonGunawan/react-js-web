export function Spinner() {
  return (
    <div className="d-flex justify-content-center align-item-center py-5">
      <div
        className="spinner-border"
        style={{ color: "var(--cs-primary)" }}
        role="status"
      >
        <span className="visual-hidden">Loading...</span>
      </div>
    </div>
  );
}
