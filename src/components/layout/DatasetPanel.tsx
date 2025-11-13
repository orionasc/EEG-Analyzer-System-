import React, { useState } from 'react';
import type { EEGData } from '../../types';
import { parseCSVData, validateEEGData } from '../../utils/dataGenerator';
import { CollapsibleSection } from './CollapsibleSection';

type SampleDataset = {
  id: string;
  name: string;
  description: string;
  data: EEGData;
};

interface DatasetPanelProps {
  samples: SampleDataset[];
  onLoadSample: (sample: SampleDataset) => void;
  onUpload: (data: EEGData, label: string) => void;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  activeDatasetId: string | null;
}

export const DatasetPanel: React.FC<DatasetPanelProps> = ({
  samples,
  onLoadSample,
  onUpload,
  apiKey,
  onApiKeyChange,
  activeDatasetId
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSVData(text);
      if (!parsed) {
        alert('Failed to parse CSV file.');
        return;
      }

      const validation = validateEEGData(parsed);
      if (!validation.valid) {
        alert('Invalid EEG data:\n' + validation.errors.join('\n'));
        return;
      }

      onUpload(parsed, file.name);
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
    <CollapsibleSection title="Dataset Selection" contentClassName="text-[12px]">
      <div className="space-y-4">
        <section className="space-y-2">
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Sample Datasets</h4>
          <ul className="space-y-2">
            {samples.map((sample) => {
              const isActive = activeDatasetId === sample.id;
              return (
                <li
                  key={sample.id}
                  className={`rounded-lg border px-3 py-2 transition ${
                    isActive
                      ? 'border-blue-400/60 bg-blue-500/10 text-blue-100'
                      : 'border-white/5 bg-slate-900/70'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onLoadSample(sample)}
                    className={`flex w-full flex-col text-left text-[12px] transition ${
                      isActive ? 'text-blue-100' : 'text-slate-100 hover:text-blue-300'
                    }`}
                  >
                    <span className="font-medium">{sample.name}</span>
                    <span className="mt-1 text-[11px] leading-snug text-slate-300">
                      {sample.description}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="space-y-2">
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Upload CSV</h4>
          <label
            htmlFor="dataset-upload"
            className={`flex min-h-[68px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-500/60 bg-slate-900/70 px-3 text-center text-[11px] uppercase tracking-[0.18em] transition ${
              isDragging ? 'border-blue-400/70 text-blue-200' : 'text-slate-400 hover:border-slate-400'
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
              id="dataset-upload"
              type="file"
              accept=".csv"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  handleFile(file);
                }
              }}
              hidden
            />
            <span>{isDragging ? 'Drop file to upload' : 'Choose file'}</span>
          </label>
        </section>
        <section className="space-y-2">
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Claude API Key</h4>
          <input
            type="password"
            value={apiKey}
            onChange={(event) => onApiKeyChange(event.target.value)}
            placeholder="Enter API key"
            className="w-full rounded border border-white/10 bg-slate-950/80 px-2 py-2 text-[12px] text-slate-100 placeholder:text-slate-500"
          />
        </section>
      </div>
    </CollapsibleSection>
  );
};
