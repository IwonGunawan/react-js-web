import React, { useState } from "react";

interface Props {
  onSearch: (value: string) => void;
  placeholder?: string;
}
export default function SearchInput({
  onSearch,
  placeholder = "Cari...",
}: Props) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="input-group input-group-sm" style={{ maxWidth: 280 }}>
      <span className="input-group-text bg-white">
        <i className="bi bi-search text-muted" />
      </span>
      <input
        type="text"
        className="form-control border-start-0"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {value && (
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            (setValue(""), onSearch(""));
          }}
        >
          <i className="bi bi-x" />
        </button>
      )}
    </div>
  );
}
