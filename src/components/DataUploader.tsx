import { useCallback } from 'react';
import { parseCSVData, validateEEGData } from '../utils/dataGenerator';
import type { EEGData } from '../types';

interface DataUploaderProps {
  onDataLoaded: (data: EEGData) => void;
}

export const DataUploader: React.FC<DataUploaderProps> = ({ onDataLoaded }) => {
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const data = parseCSVData(text);

        if (data) {
          const validation = validateEEGData(data);
          if (validation.valid) {
            onDataLoaded(data);
          } else {
            alert('Invalid EEG data:\n' + validation.errors.join('\n'));
          }
        } else {
          alert('Failed to parse CSV file. Please check the format.');
        }
      };
      reader.readAsText(file);
    },
    [onDataLoaded]
  );

  return (
    <div className="rounded-2xl border border-[rgba(198,188,255,0.2)] bg-[rgba(17,13,28,0.78)] p-6 text-[rgba(236,229,220,0.78)] shadow-[0_24px_48px_rgba(8,4,18,0.45)]">
      <h3 className="mb-5 text-base font-semibold text-[rgba(249,245,236,0.95)]">Upload EEG Data</h3>

      <div className="rounded-2xl border-2 border-dashed border-[rgba(198,188,255,0.35)] bg-[rgba(23,18,33,0.6)] p-8 text-center transition hover:border-[rgba(105,217,255,0.45)] hover:bg-[rgba(23,18,33,0.72)]">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex cursor-pointer flex-col items-center space-y-3 text-[rgba(236,229,220,0.78)]"
        >
          <svg
            className="h-8 w-8 text-[rgba(105,217,255,0.8)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div>
            <span className="block text-sm font-medium text-[rgba(249,245,236,0.95)]">
              Click to upload or drag and drop
            </span>
            <span className="mt-1 block text-xs text-[rgba(214,205,196,0.7)]">CSV files only</span>
          </div>
        </label>
      </div>

      <div className="mt-4 rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(23,18,33,0.72)] p-3">
        <p className="mb-2 text-xs font-medium text-[rgba(236,229,220,0.55)]">Expected CSV format:</p>
        <code className="block rounded border border-[rgba(198,188,255,0.18)] bg-[rgba(15,12,24,0.82)] p-3 text-xs font-mono text-[rgba(236,229,220,0.75)]">
          Time,Channel1,Channel2,...<br />
          0.000,1.23,4.56,...<br />
          0.004,1.45,4.23,...
        </code>
      </div>
    </div>
  );
};
