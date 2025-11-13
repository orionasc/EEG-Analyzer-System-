import React from 'react';

type DatasetOption = {
  id: string;
  label: string;
};

interface TopBarProps {
  title: string;
  subtitle: string;
  datasetOptions: DatasetOption[];
  selectedDatasetId: string | null;
  onDatasetChange: (id: string) => void;
  samplingRate: number | null;
  channelCount: number | null;
  isClaudeConnected: boolean;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  datasetOptions,
  selectedDatasetId,
  onDatasetChange,
  samplingRate,
  channelCount,
  isClaudeConnected,
  onAnalyze,
  isAnalyzing,
  canAnalyze
}) => {
  return (
    <header className="top-bar">
      <div className="top-bar__content">
        <div className="top-bar__left">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="top-bar__right">
          <label className="top-bar__item">
            <span>Dataset</span>
            <select
              value={selectedDatasetId ?? ''}
              onChange={(event) => onDatasetChange(event.target.value)}
            >
              <option value="">Select dataset</option>
              {datasetOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="top-bar__item">
            <span>Sampling Rate</span>
            <strong>{samplingRate ? `${samplingRate} Hz` : '—'}</strong>
          </div>
          <div className="top-bar__item">
            <span>Channels</span>
            <strong>{channelCount ?? '—'}</strong>
          </div>
          <div className="top-bar__item">
            <span>Claude</span>
            <strong>{isClaudeConnected ? 'Connected' : 'Simulated'}</strong>
          </div>
          <button className="top-bar__action" onClick={onAnalyze} disabled={!canAnalyze || isAnalyzing}>
            {isAnalyzing ? 'Analyzing…' : 'Analyze'}
          </button>
        </div>
      </div>
    </header>
  );
};
