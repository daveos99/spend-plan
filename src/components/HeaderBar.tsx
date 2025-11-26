import React, { useRef } from 'react';

interface HeaderBarProps {
  year: number;
  onUpload: (file: File) => void;
  onDownload: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ year, onUpload, onDownload }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    event.target.value = '';
  };

  return (
    <header className="panel row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="stack">
        <div className="row" style={{ alignItems: 'baseline', gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>Spend Plan</h1>
          <span className="badge">Year {year}</span>
        </div>
        <p className="muted" style={{ margin: 0 }}>
          Offline-first budgeting. Data stays on your device. Export/import JSON to move plans between sessions.
        </p>
      </div>
      <div className="row">
        <input
          ref={inputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button className="btn" onClick={() => inputRef.current?.click()}>
          Upload plan
        </button>
        <button className="btn btn-primary" onClick={onDownload}>
          Download plan
        </button>
      </div>
    </header>
  );
};
