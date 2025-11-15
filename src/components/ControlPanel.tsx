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
    <div className="cl-slab cl-veil space-y-6 rounded-3xl border border-[rgba(198,188,255,0.2)] bg-[rgba(17,13,28,0.78)] px-[var(--cl-h-gutter)] py-6">
      <div className="cl-slab-edge" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[rgba(236,229,220,0.55)]">Dataset Control</p>
          <h3 className="text-xl font-semibold text-[rgba(249,245,236,0.98)]">Curate Your EEG Session</h3>
        </div>
        <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[rgba(105,217,255,0.15)] text-lg text-[rgba(105,217,255,0.85)] sm:flex">
          🎛️
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">Load Sample Dataset</p>
        <div className="grid grid-cols-1 gap-3">
          {samples.map((sample, idx) => (
            <button
              key={sample.name}
              onClick={() => onLoadSample(sample.data)}
              className="group relative flex items-center gap-4 rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(23,18,33,0.72)] px-4 py-3 text-left shadow-[0_18px_40px_rgba(7,4,15,0.45)] transition-transform duration-300 hover:-translate-y-[2px] hover:border-[rgba(105,217,255,0.35)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(105,217,255,0.16)] text-lg">
                {sampleIcons[idx] ?? '🧠'}
              </div>
              <div>
                <p className="text-sm font-semibold text-[rgba(249,245,236,0.95)]">{sample.name}</p>
                <p className="text-xs text-[rgba(214,205,196,0.72)] leading-relaxed">{sample.description}</p>
              </div>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-[rgba(105,217,255,0.85)] opacity-0 transition group-hover:opacity-100">
                ↗
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 py-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(198,188,255,0.2)] to-transparent" />
        <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-[rgba(236,229,220,0.55)]">or</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(198,188,255,0.2)] to-transparent" />
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">Upload CSV</p>
        <label
          htmlFor="sidebar-upload"
          className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
            isDragging
              ? 'border-[rgba(105,217,255,0.6)] bg-[rgba(105,217,255,0.12)] text-[rgba(105,217,255,0.9)] scale-[1.02] shadow-[0_0_18px_rgba(105,217,255,0.35)]'
              : 'border-[rgba(198,188,255,0.3)] bg-[rgba(23,18,33,0.6)] text-[rgba(214,205,196,0.7)] hover:border-[rgba(105,217,255,0.45)] hover:bg-[rgba(23,18,33,0.7)]'
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
            <p className="text-sm font-semibold text-[rgba(249,245,236,0.95)]">Drop CSV file here</p>
            <p className="text-xs text-[rgba(214,205,196,0.7)]">or click to browse</p>
          </div>
          <p className="text-[11px] text-[rgba(236,229,220,0.55)]">Expected: Time,Ch1,Ch2,...</p>
        </label>
      </div>

      <div>
        <button
          onClick={onAnalyze}
          disabled={!hasData || isAnalyzing}
          className="cl-node-button flex w-full items-center justify-center gap-3 py-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="cl-node-spark" aria-hidden />
          {isAnalyzing ? 'Analyzing EEG Data...' : 'Analyze EEG Data'}
        </button>
        <p className="mt-3 text-[11px] text-[rgba(214,205,196,0.65)]">
          {hasData
            ? 'Ready to synthesize spectral insights using AI co-pilot.'
            : 'Load a curated sample or upload raw EEG to enable the analysis engine.'}
        </p>
      </div>

      <div className="rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(23,18,33,0.72)] px-[var(--cl-h-gutter)] py-4">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)] mb-2">Claude API</p>
        <p className="text-xs text-[rgba(214,205,196,0.7)] mb-3">
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
          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(105,217,255,0.35)] bg-[rgba(105,217,255,0.12)] px-4 py-2 text-xs font-semibold text-[rgba(105,217,255,0.9)] hover:border-[rgba(105,217,255,0.5)]"
        >
          Manage API Key
          <span className="text-sm">↗</span>
        </button>
      </div>
    </div>
  );
};
