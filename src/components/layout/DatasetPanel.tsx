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
  userTargetQuery: string;
  onUserTargetQueryChange: (value: string) => void;
  compareToCohort: boolean;
  onCompareToCohortChange: (value: boolean) => void;
}

export const DatasetPanel: React.FC<DatasetPanelProps> = ({
  samples,
  onLoadSample,
  onUpload,
  apiKey,
  onApiKeyChange,
  activeDatasetId,
  userTargetQuery,
  onUserTargetQueryChange,
  compareToCohort,
  onCompareToCohortChange
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
    <CollapsibleSection title="Dataset Architecture" contentClassName="text-sm">
      <div className="space-y-6">
        <section className="space-y-3">
          <h4 className="text-[11px] uppercase tracking-[0.28em] text-[rgba(236,229,220,0.58)]">Sample Datasets</h4>
          <ul className="space-y-2">
            {samples.map((sample) => {
              const isActive = activeDatasetId === sample.id;
              return (
                <li key={sample.id}>
                  <button
                    type="button"
                    onClick={() => onLoadSample(sample)}
                    className={`group flex w-full items-start gap-3 rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(23,18,33,0.78)] p-3 text-left transition-transform duration-300 hover:translate-x-[1px] hover:border-[rgba(198,188,255,0.3)] ${
                      isActive ? 'ring-1 ring-[rgba(105,217,255,0.4)] shadow-[0_0_20px_rgba(105,217,255,0.2)]' : ''
                    }`}
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(105,217,255,0.16)] text-xs font-semibold text-[rgba(249,245,236,0.85)] shadow-[0_0_12px_rgba(105,217,255,0.25)]">
                      ⧉
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-[rgba(249,245,236,0.95)]">{sample.name}</span>
                      <span className="mt-1 text-xs text-[rgba(214,205,196,0.72)]">{sample.description}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="space-y-3">
          <h4 className="text-[11px] uppercase tracking-[0.28em] text-[rgba(236,229,220,0.58)]">Upload CSV</h4>
          <label
            htmlFor="dataset-upload"
            className={`flex min-h-[76px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(198,188,255,0.28)] bg-[rgba(21,16,32,0.7)] px-4 text-center text-xs text-[rgba(214,205,196,0.7)] transition-all duration-300 hover:border-[rgba(105,217,255,0.45)] hover:text-[rgba(249,245,236,0.9)] ${
              isDragging ? 'border-[rgba(105,217,255,0.6)] text-[rgba(249,245,236,0.92)] shadow-[0_0_18px_rgba(105,217,255,0.35)]' : ''
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

        <section className="space-y-3">
          <h4 className="text-[11px] uppercase tracking-[0.28em] text-[rgba(236,229,220,0.58)]">Claude API Key</h4>
          <input
            type="password"
            value={apiKey}
            onChange={(event) => onApiKeyChange(event.target.value)}
            placeholder="Enter API key"
            className="cl-input"
          />
        </section>

        <section className="space-y-3">
          <h4 className="text-[11px] uppercase tracking-[0.28em] text-[rgba(236,229,220,0.58)]">Targeted Analysis Query</h4>
          <input
            type="text"
            value={userTargetQuery}
            onChange={(event) => onUserTargetQueryChange(event.target.value)}
            placeholder="e.g. cognitive workload, meditative depth"
            className="cl-input"
          />
        </section>

        <section className="flex items-center justify-between rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(23,18,33,0.78)] px-4 py-3 text-xs text-[rgba(236,229,220,0.78)]">
          <label htmlFor="cohort-toggle" className="font-medium text-[rgba(249,245,236,0.85)]">
            Compare to typical EEG profiles
          </label>
          <input
            id="cohort-toggle"
            type="checkbox"
            checked={compareToCohort}
            onChange={(event) => onCompareToCohortChange(event.target.checked)}
            className="cl-toggle"
          />
        </section>
      </div>
    </CollapsibleSection>
  );
};
