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
    <CollapsibleSection title="Dataset Selection" contentClassName="text-sm">
      <div className="space-y-5">
        <section className="space-y-2">
          <h4 className="text-xs font-medium text-slate-300">Sample datasets</h4>
          <ul className="space-y-2">
            {samples.map((sample) => {
              const isActive = activeDatasetId === sample.id;
              return (
                <li key={sample.id}>
                  <button
                    type="button"
                    onClick={() => onLoadSample(sample)}
                    className={`group flex w-full items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left text-sm text-slate-100 transition-colors hover:bg-white/10 ${
                      isActive ? 'ring-1 ring-inset ring-blue-400/60 shadow-[0_0_8px_rgba(0,200,255,0.5)]' : ''
                    }`}
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/40 to-cyan-400/30 text-xs text-cyan-100 shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
                      ⧉
                    </span>
                    <span className="flex flex-col">
                      <span className="font-medium text-slate-100">{sample.name}</span>
                      <span className="mt-1 text-xs text-slate-300">{sample.description}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="space-y-2">
          <h4 className="text-xs font-medium text-slate-300">Upload CSV</h4>
          <label
            htmlFor="dataset-upload"
            className={`flex min-h-[72px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 px-4 text-center text-xs text-slate-300 transition-colors hover:bg-white/10 ${
              isDragging ? 'border-blue-400/70 text-blue-200' : ''
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
          <h4 className="text-xs font-medium text-slate-300">Claude API key</h4>
          <input
            type="password"
            value={apiKey}
            onChange={(event) => onApiKeyChange(event.target.value)}
            placeholder="Enter API key"
            className="w-full rounded-lg border border-white/10 bg-[#0b1220]/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
          />
        </section>
      </div>
    </CollapsibleSection>
  );
};
