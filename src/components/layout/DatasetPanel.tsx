import React, { useState } from 'react';
import type { EEGData } from '../../types';
import { parseCSVData, validateEEGData } from '../../utils/dataGenerator';

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
}

export const DatasetPanel: React.FC<DatasetPanelProps> = ({
  samples,
  onLoadSample,
  onUpload,
  apiKey,
  onApiKeyChange
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
    <details className="sidebar-panel" open>
      <summary>Dataset Selection</summary>
      <div className="sidebar-panel__content">
        <section>
          <h4>Sample Datasets</h4>
          <ul>
            {samples.map((sample) => (
              <li key={sample.id}>
                <button type="button" onClick={() => onLoadSample(sample)}>
                  {sample.name}
                </button>
                <p>{sample.description}</p>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h4>Upload CSV</h4>
          <label
            htmlFor="dataset-upload"
            className={isDragging ? 'upload-zone upload-zone--active' : 'upload-zone'}
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
        <section>
          <h4>Claude API Key</h4>
          <input
            type="password"
            value={apiKey}
            onChange={(event) => onApiKeyChange(event.target.value)}
            placeholder="Enter API key"
          />
        </section>
      </div>
    </details>
  );
};
