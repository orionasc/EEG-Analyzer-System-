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
    <div className="w-full bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center mb-5">
        <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-3"></div>
        <h3 className="text-lg font-semibold text-gray-800">Upload EEG Data</h3>
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 hover:bg-purple-50/30 transition-all duration-200 group">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg
              className="w-6 h-6 text-purple-600"
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
          </div>
          <div>
            <span className="text-sm text-gray-700 font-medium block">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-gray-500 mt-1 block">CSV files only</span>
          </div>
        </label>
      </div>
      <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
        <p className="text-xs font-medium text-gray-700 mb-2 flex items-center">
          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Expected CSV format:
        </p>
        <code className="block bg-white p-2.5 rounded text-xs text-gray-600 font-mono border border-gray-200">
          Time,Channel1,Channel2,...<br />
          0.000,1.23,4.56,...<br />
          0.004,1.45,4.23,...
        </code>
      </div>
    </div>
  );
};
