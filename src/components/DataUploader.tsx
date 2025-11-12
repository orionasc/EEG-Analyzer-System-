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
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Upload EEG Data</h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <svg
            className="w-12 h-12 text-gray-400"
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
          <span className="text-sm text-gray-600">
            Click to upload or drag and drop
          </span>
          <span className="text-xs text-gray-500">CSV files only</span>
        </label>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        <p className="mb-1">Expected CSV format:</p>
        <code className="block bg-gray-100 p-2 rounded">
          Time,Channel1,Channel2,...<br />
          0.000,1.23,4.56,...<br />
          0.004,1.45,4.23,...
        </code>
      </div>
    </div>
  );
};
