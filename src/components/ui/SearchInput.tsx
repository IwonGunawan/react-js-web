import React, { useEffect, useRef, useState } from "react";

interface Props {
  onSearch: (value: string) => void;
  placeholder?: string;
  delay?: number;
}

export default function SearchInput({
  onSearch,
  placeholder = "Cari...",
  delay = 300,
}: Props) {
  const [value, setValue] = useState("");
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onSearchRef.current(value);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [value, delay]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="input-group input-group-sm cs-search">
      <span className="input-group-text bg-white">
        <i className="bi bi-search text-muted" aria-hidden="true" />
      </span>
      <input
        type="text"
        className="form-control border-start-0 ps-0"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          className="btn btn-outline-secondary"
          aria-label="Bersihkan pencarian"
          onClick={() => {
            setValue("");
            onSearchRef.current("");
          }}
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
