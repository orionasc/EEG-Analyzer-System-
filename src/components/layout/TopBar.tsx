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
  datasetDuration: number | null;
  activeDatasetLabel: string | null;
  activeDatasetDescription: string | null;
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
  datasetDuration,
  activeDatasetLabel,
  activeDatasetDescription,
  isClaudeConnected,
  onAnalyze,
  isAnalyzing,
  canAnalyze
}) => {
  return (
    <header className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex min-w-[240px] flex-col gap-3">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-300">{subtitle}</span>
            <h1 className="text-lg font-semibold text-white">{title}</h1>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <p className="text-xs text-slate-300">Active dataset</p>
            <p className="text-sm font-medium text-white">{activeDatasetLabel ?? 'No dataset selected'}</p>
            <p className="mt-1 text-xs text-slate-400">
              {activeDatasetDescription ?? 'Choose a dataset to populate metadata.'}
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-3 text-xs text-slate-200">
          <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-slate-300">Dataset</span>
            <select
              value={selectedDatasetId ?? ''}
              onChange={(event) => onDatasetChange(event.target.value)}
              className="min-w-[150px] rounded-md border border-white/10 bg-[#0f172a]/60 px-2 py-1 text-xs text-slate-100 focus:border-blue-400 focus:outline-none"
            >
              <option value="">Select dataset</option>
              {datasetOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-slate-300">Sampling</span>
            <strong className="font-medium text-white">{samplingRate ? `${samplingRate} Hz` : '—'}</strong>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-slate-300">Channels</span>
            <strong className="font-medium text-white">{channelCount ?? '—'}</strong>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-slate-300">Duration</span>
            <strong className="font-medium text-white">
              {datasetDuration ? `${datasetDuration.toFixed(1)} s` : '—'}
            </strong>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-slate-300">Claude</span>
            <strong className="font-medium text-white">{isClaudeConnected ? 'Connected' : 'Simulated'}</strong>
          </div>
          <button
            className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-600"
            onClick={onAnalyze}
            disabled={!canAnalyze || isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing…' : 'Analyze'}
          </button>
        </div>
      </div>
    </header>
  );
};
