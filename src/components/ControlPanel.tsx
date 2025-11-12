import { useMemo, useState } from 'react';
import { getSampleDatasets, parseCSVData, validateEEGData } from '../utils/dataGenerator';
import type { EEGData } from '../types';

interface ControlPanelProps {
  onLoadSample: (data: EEGData) => void;
  onAnalyze: () => void;
  onDataUpload: (data: EEGData) => void;
  isAnalyzing: boolean;
  apiKey: string;
  hasData: boolean;
}

const sampleIcons = ['🧘', '🎯', '😴', '💤'];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onLoadSample,
  onAnalyze,
  onDataUpload,
  isAnalyzing,
  apiKey,
  hasData
}) => {
  const samples = useMemo(() => getSampleDatasets(), []);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSVData(text);
      if (parsed) {
        const validation = validateEEGData(parsed);
        if (validation.valid) {
          onDataUpload(parsed);
        } else {
          alert('Invalid EEG data:\n' + validation.errors.join('\n'));
        }
      } else {
        alert('Failed to parse CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="rounded-3xl border border-white/40 bg-white/75 backdrop-blur shadow-[var(--shadow-md)] p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Dataset Control</p>
          <h3 className="text-xl font-semibold text-gray-900">Curate Your EEG Session</h3>
        </div>
        <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-lg">🎛️</div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium uppercase text-gray-500 tracking-wide">Load Sample Dataset</p>
        <div className="grid grid-cols-1 gap-3">
          {samples.map((sample, idx) => (
            <button
              key={sample.name}
              onClick={() => onLoadSample(sample.data)}
              className="group relative flex items-center gap-4 rounded-2xl border border-gray-100 bg-white/90 px-4 py-3 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg">{sampleIcons[idx] ?? '🧠'}</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{sample.name}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{sample.description}</p>
              </div>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-blue-400 opacity-0 transition group-hover:opacity-100">
                ↗
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 py-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-gray-400">or</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase text-gray-500 tracking-wide">Upload CSV</p>
        <label
          htmlFor="sidebar-upload"
          className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
            isDragging
              ? 'border-blue-400 bg-blue-50/60 text-blue-600 scale-[1.02]'
              : 'border-gray-200 bg-gray-50/60 text-gray-500 hover:border-blue-300 hover:bg-blue-50/40'
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
        >
          <input
            id="sidebar-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                handleFile(file);
              }
            }}
          />
          <div className="text-2xl">📁</div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Drop CSV file here</p>
            <p className="text-xs text-gray-500">or click to browse</p>
          </div>
          <p className="text-[11px] text-gray-400">Expected: Time,Ch1,Ch2,...</p>
        </label>
      </div>

      <div className="mt-6">
        <button
          onClick={onAnalyze}
          disabled={!hasData || isAnalyzing}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-4 text-base font-semibold text-white shadow-[var(--shadow-colored)] transition hover:shadow-[var(--shadow-xl)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAnalyzing ? (
            <>
              <span className="relative flex h-5 w-5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75"></span>
                <span className="relative inline-flex h-5 w-5 rounded-full bg-white/90"></span>
              </span>
              Analyzing EEG Data...
            </>
          ) : (
            <>
              <span className="text-lg">🚀</span>
              Analyze EEG Data
            </>
          )}
        </button>
        <p className="mt-3 text-[11px] text-gray-400">
          {hasData
            ? 'Ready to synthesize spectral insights using AI co-pilot.'
            : 'Load a curated sample or upload raw EEG to enable the analysis engine.'}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white/80 p-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Claude API</p>
        <p className="text-xs text-gray-500 mb-3">
          {apiKey
            ? 'Secure connection active. Claude intelligence will enhance interpretations.'
            : 'No API key detected. Using built-in simulated insights.'}
        </p>
        <button
          type="button"
          onClick={() => {
            const input = document.getElementById('header-api-key');
            if (input instanceof HTMLInputElement) {
              input.focus();
              input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-2 text-xs font-semibold text-blue-600 hover:border-blue-200 hover:bg-blue-100"
        >
          Manage API Key
          <span className="text-sm">↗</span>
        </button>
      </div>
    </div>
  );
};
